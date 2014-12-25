'use strict';

/**
 * 创建 Label Dao 用来操作 LabelModel，实现数据的增删改查等功能
 * @module LabelDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-27
 * */
function LabelDao(Model) {
  this.model = Model;
}

var LabelModel = require('../../models/blog/LabelModel');
var labelDao = new LabelDao(LabelModel);

module.exports = labelDao;

var underscore = require('underscore');


/**
 * 分页显示
 * @method
 * @param dataPage {DataPage} 分页数据
 * @param searchContent {String} 搜索内容
 * @param loginName {String} 用户名
 * @param callback {function} 回调函数
 */
LabelDao.prototype.pagination = function (dataPage, searchContent, loginName, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  var conditions = {account: loginName};
  if (searchContent) {
    var match = new RegExp(searchContent, 'ig');
    underscore.extend(conditions, { $or: [
      { name: match } ,
      { description: match }
    ] });
  }
  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      model.find(conditions, null, {skip: skip, limit: limit, sort: {_id: -1}}, function (err, docs) {
        dataPage.setItems(docs);
        return callback(err, dataPage);
      });
    }
  });
};

/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {LabelModel} LabelModel 实例
 * @param callback {function}回调函数
 */

LabelDao.prototype.save = function (data, callback) {
  var id = data._id;
  if (id) {
    delete data._id;
    this.model.update({_id: id}, data, function (err, numberAffected, rawResponse) {
      return callback(err);
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
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
LabelDao.prototype.findById = function (id, callback) {
  this.model.findOne({_id: id}, function (err, model) {
    return callback(err, model);
  });
};

/**
 * 根据给定的条件查询记录
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 * @param fields {Object} 显示的列
 */
LabelDao.prototype.find = function (conditions, callback, fields) {
  if (fields) {
    this.model.find(conditions, fields, function (err, docs) {
      return callback(err, docs);
    });
  } else {
    this.model.find(conditions, function (err, docs) {
      return callback(err, docs);
    });
  }
};

/**
 * 取经常使用的标签，默认取前十条
 * @param num
 * @param loginName 用户名
 * @param callback
 */
LabelDao.prototype.frequentList = function (num, loginName, callback) {
  num = num || 10;//默认为10

  //var conditions = {account: loginName, count: { $gt: 0 }};
  // 这里修改为取所有的
  var conditions = {account: loginName};

  this.model.find(conditions, {_id: 1, name: 1, count: 1}).sort({count: -1}).limit(num).exec(function (err, docs) {
      return callback(err, docs);
    });
};

/**
 * 删除记录
 * 这里不再删除在文章中引用的该标签
 * 文章中引用的该标签在显示的时候会屏蔽掉
 * 同时如果修改该文章的时候会删掉不存在的标签的
 * @method
 * @param ids { Array }
 * @param callback {function} 回调函数
 */
LabelDao.prototype.delete = function (ids, callback) {
  //要删除数据的条件，例如：{ field: { $n: [<value1>, <value2>, ... <valueN> ] } }
  var conditions = { _id: { $in: ids } };
  this.model.remove(conditions, function (err) {
    return callback(err);
  });
};

/**
 * 根据name值，修改label，如果不存在则添加新的记录
 * 添加和修改文章的时候，会调用该方法
 * @method
 * @param loginName {String} 账户登录名
 * @param labels { Array } name 组成的数组
 * @param callback {function} 回调函数
 */
LabelDao.prototype.update = function (loginName, labels, callback) {
  if (underscore.isEmpty(labels)) {
    return callback(null);
  }
  var label;
  /*jshint -W083*/
  for (var i = 0, len = labels.length; i < len; i++) {
    label = labels[i];
    var conditions = {name: label, account: loginName};
    var update = {$inc: {count: 1}, $setOnInsert: { name: label, createdDate: new Date(), account: loginName}};
    if (underscore.isObject(label)) {
      conditions = {name: label.name, account: loginName};
      update = {$inc: {count: label.increase ? 1 : -1}, $setOnInsert: { name: label.name, createdDate: new Date(), account: loginName}};
    }
    this.model.update(conditions, update, {upsert: true}, function (err, numberAffected, rawResponse) {
      if(err){
        return callback(err);
      }
     });
  }
  return callback();
};

/**
 * 当删除文章时，修改引用label的count值
 * @param labels{ Array } 要修改的 label 数组
 * @param callback
 */
LabelDao.prototype.reduceCount = function (labels, callback) {
  var label;
  /*jshint -W083*/
  for(label in labels){
    if(labels.hasOwnProperty(label)){
      this.model.update({_id: label}, {$inc: {count: -labels[label]}}, function (err, numberAffected, rawResponse) {
        if(err){
          return callback(err);
        }
      });
    }
  }
  return callback();
};
