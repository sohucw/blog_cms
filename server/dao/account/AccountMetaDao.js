'use strict';

/**
 * 创建 AccountMeta Dao 用来操作 AccountMetaModel，实现数据的增删改查等功能
 * @module AccountMetaDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-7
 * */
function AccountMetaDao(Model) {
  this.model = Model;
}

/**
 * 设置主题
 * @param loginName
 * @param themeCode
 * @param callback
 */
AccountMetaDao.prototype.setTheme = function (loginName, themeCode, callback) {
  var update = {$set: {theme: themeCode}, $setOnInsert: { loginName: loginName, createdDate: new Date()}};
  this.model.update({loginName: loginName}, update, {upsert: true},
    function (err, numberAffected, rawResponse) {
      callback(err);
    });
};

/**
 * 根据账户查找主题
 * @param loginName
 * @param callback
 */
AccountMetaDao.prototype.findTheme = function (loginName, callback) {
  this.model.findOne({loginName: loginName}, {theme: 1}, function (err, doc) {
    if (err) {
      return callback(err);
    }
    if (doc && doc.theme) {
      callback(null, doc.theme);
    } else {
      callback(null, null);
    }
  });
};

var AccountMetaModel = require('../../models/account/AccountMetaModel');
var accountMetaDao = new AccountMetaDao(AccountMetaModel);
module.exports = accountMetaDao;