'use strict';

/**
 * 创建 Demo Dao 用来操作 DemoModel，实现数据的增删改查等功能
 * @module DemoDao
 * @class
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */
function DemoDao(Model) {
  this.model = Model;
}

var DemoModel = require('../../models/examples/DemoModel');
var demoDao = new DemoDao(DemoModel);

module.exports = demoDao;

/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {DemoModel} DemoModel 实例
 * @param callback {function}回调函数
 */
DemoDao.prototype.save = function (data, callback) {
  if (data._id) {
    var update = {
      title: data.title,
      content: data.content,
      updatedDate: new Date()
    };
    this.model.update({_id: data._id}, update, function (err, numberAffected, rawResponse) {
      return callback(err, {updatedDate: update.updatedDate});
    });
  } else {
    var entity = new this.model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      return callback(err, product._doc);
    });
  }
};

/**
 * 返回数据列表
 * @method
 * @param callback {function} 回调函数
 */
DemoDao.prototype.list = function (callback) {
  this.model.find({}, function (err, docs) {
    return callback(err, docs);
  });
};

/**
 * 分页显示
 * @method
 * @param dataPage {DataPage} 分页数据
 * @param callback {function} 回调函数
 */
DemoDao.prototype.pagination = function (dataPage, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  model.count({}, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      model.find({}, null, {skip: skip, limit: limit}, function (err, docs) {
        dataPage.setItems(docs);
        return callback(err, dataPage);
      });
    }
  });
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
DemoDao.prototype.findById = function (id, callback) {
  this.model.findOne({_id: id}, function (err, model) {
    return callback(err, model);
  });
};

/**
 * 删除记录
 * @method
 * @param conditions { Object }
 * 要删除数据的条件，例如：{ field: { $n: [<value1>, <value2>, ... <valueN> ] } }
 * @param callback {function} 回调函数
 */
DemoDao.prototype.delete = function (conditions, callback) {
  var query = this.model.remove(conditions, function (err) {
    return callback(err);
  });
  //query.exec();
};

/**
 * 保存分页数据
 * @method
 * @param data  {DemoModel} DemoModel 实例
 * @param callback  {function} 回调函数
 */
DemoDao.prototype.savePagination = function (data, callback) {
  if (data._id) {
    var update = {
      title: data.title,
      content: data.content,
      updatedDate: new Date()
    };
    this.model.update({_id: data._id}, update, function (err, numberAffected, rawResponse) {
      return callback(err, {updatedDate: update.updatedDate});
    });
  } else {
    var entity = new this.model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      return callback(err);
    });
  }
};
