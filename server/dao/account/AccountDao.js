'use strict';

/**
 * 加密算法
 * @type {hash}
 */
var hash = require('../../utils/passwordCrypto').hash;
var errorCodes = require('../../utils/errorCodes');

/**
 * 创建 Account Dao 用来操作 AccountModel，实现数据的增删改查等功能
 * @module AccountDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-9
 * */
function AccountDao(Model) {
  this.model = Model;
}

/**
 * 判断登录名和密码是否正确
 * 采用异步回调处理同步 Promise
 * http://mongoosejs.com/docs/api.html#promise_Promise
 * @param data
 * @param callback
 */
AccountDao.prototype.findByLoginNameAndPassword = function (data, callback) {
  var loginName = data.loginName, password = data.password;

  this.model.findOne({loginName: loginName}, function (err, account) {
    if (account) {
      if (account.activated === false) {
        return callback(-3);
      }
      hash(password, account.salt, function (err, hash) {
        if (err) {
          return callback(-2);
        }
        if (hash === account.hash) {
          return callback(1, account);
        } else {//密码不正确
          return callback(-2);
        }
      });
    } else {//登录名不正确
      return callback(-1);
    }
  });
};

/**
 * 注册用户
 * @method
 * @param data {AccountModel} AccountModel 实例
 * @param callback {function}回调函数
 */
AccountDao.prototype.signup = function (data, callback) {
  var loginName = data.loginName;
  var password = data.password;
  var email = data.email;
  delete data.password;
  if (!loginName || !password) {//前端已校验，如果传过来的值为空，则是非法操作
    return callback(new Error(errorCodes['9002']));
  }
  //校验密码规则
  if (!/(^[a-zA-Z!@#$%^&*().]+[0-9]+|[0-9]+[a-zA-Z!@#$%^&*().]+[0-9]*$)/.test(password)) {
    return callback(new Error(errorCodes['9002']));
  }

  var conditions = { $or: [
    { loginName: loginName } ,
    { email: email }
  ] };
  var model = this.model;

  accountDao.find(conditions, function (err, models) {
    if (err || models.length > 0) {
      return callback(new Error(errorCodes['9008']));
    } else {

      hash(password, function (err, salt, hash) {
        if (err) {
          return callback(err);
        }
        data.salt = salt;
        data.hash = hash;

        var entity = new model(data);
        //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
        entity.save(function (err, product, numberAffected) {
          return callback(err, product._doc);
        });
      });
    }
  });
};


/**
 * 初始化数据
 * @method
 * @param data {AccountModel} AccountModel 实例
 * @param callback {function}回调函数
 */
AccountDao.prototype.init = function (data, callback) {
  var password = data.password;
  delete data.password;

  var model = this.model;
  hash(password, function (err, salt, hash) {
    if (err) {
      return callback(err);
    }
    data.salt = salt;
    data.hash = hash;

    var entity = new model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      return callback(err, product._doc);
    });
  });
};

/**
 * 分页显示
 * @method
 * @param dataPage {DataPage} 分页数据
 * @param searchContent {String} 搜索内容
 * @param callback {function} 回调函数
 */
AccountDao.prototype.pagination = function (dataPage, searchContent, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  var conditions = {};
  if (searchContent) {
    var match = new RegExp(searchContent, 'ig');
    conditions = { $or: [
      { name: match } ,
      { loginName: match } ,
      { englishName: match } ,
      { residence: match } ,
      { position: match } ,
      { email: match } ,
      { signature: match}
    ] };
  }
  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      model.find(conditions, {_id: 1, loginName: 1, name: 1, sex: 1, residence: 1, position: 1, email: 1, site: 1, activated: 1, manager: 1}, {skip: skip, limit: limit, sort: {_id: -1}}, function (err, docs) {
        dataPage.setItems(docs);
        return callback(err, dataPage);
      });
    }
  });
};

/**
 * 修改用户状态
 * @method
 * @param conditions {Object} 查询条件
 * @param status {Boolean} 状态
 * @param callback {function}回调函数
 */

AccountDao.prototype.changeAccountStatus = function (conditions, status, callback) {
  this.model.update(conditions, {$set: {activated: status}}, { multi: true }, function (err, numberAffected, rawResponse) {
    return callback(err);
  });
};

/**
 * 根据给定的条件查询记录
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 */
AccountDao.prototype.find = function (conditions, callback) {
  this.model.find(conditions, {_id: 1, loginName: 1, name: 1, englishName: 1, sex: 1, headPortrait: 1, residence: 1,
    position: 1, email: 1, signature: 1, site: 1}, function (err, models) {
    return callback(err, models);
  });
};

/**
 * 根据给定的条件查询记录，只查询一条
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 */
AccountDao.prototype.findOne = function (conditions, callback) {
  this.model.findOne(conditions, {_id: 1, loginName: 1, name: 1, englishName: 1, sex: 1, headPortrait: 1, residence: 1,
    position: 1, email: 1, signature: 1, site: 1}, function (err, model) {
    return callback(err, model);
  });
};

/**
 * 根据账户ID修改用户信息
 * @method
 * @param id {String} 主键
 * @param data {Object} 修改的数据
 * @param callback {function}回调函数
 */

AccountDao.prototype.updateById = function (id, data, callback) {
  this.model.update({_id: id}, {$set: data}, function (err, numberAffected, rawResponse) {
    return callback(err);
  });
};

/**
 * 修改用户密码
 * @method
 * @param data {Object} 修改的信息
 * @param callback {function}回调函数
 */

AccountDao.prototype.updatePassword = function (data, callback) {
  var loginName = data.loginName, oldPassword = data.oldPassword, password = data.password;
  if (!loginName || !password) {//前端已校验，如果传过来的值为空，则是非法操作
    return callback(new Error(errorCodes['9002']));
  }
  //校验密码规则
  if (!/(^[a-zA-Z!@#$%^&*().]+[0-9]+|[0-9]+[a-zA-Z!@#$%^&*().]+[0-9]*$)/.test(password)) {
    return callback(new Error(errorCodes['9002']));
  }

  var model = this.model;
  model.findOne({loginName: loginName}, function (err, account) {
    if (account) {
      hash(oldPassword, account.salt, function (err, accountHash) {
        if (err) {
          return callback(err);
        }
        if (accountHash === account.hash) {//旧密码输入正确
          hash(password, function (err, salt, newHash) {
            if (err) {
              return callback(err);
            }
            var fields = {
              salt: salt,
              hash: newHash
            };
            model.update({loginName: loginName}, {$set: fields}, function (err, numberAffected, rawResponse) {
              return callback(err);
            });
          });

        } else {//密码不正确
          return callback(-2);
        }
      });
    } else {
      return callback(-1);
    }
  });
};

/**
 * 重置密码
 * @method
 * @param accountId {String} 账户id
 * @param password {String} 账户密码
 * @param callback {function}回调函数
 */

AccountDao.prototype.resetPassword = function (accountId, password, callback) {
  var model = this.model;
  hash(password, function (err, salt, newHash) {
    if (err) {
      return callback(err);
    }
    var fields = {
      salt: salt,
      hash: newHash
    };
    model.update({_id: accountId}, {$set: fields}, function (err, numberAffected, rawResponse) {
      return callback(err);
    });
  });
};

var AccountModel = require('../../models/account/AccountModel');
var accountDao = new AccountDao(AccountModel);
module.exports = accountDao;