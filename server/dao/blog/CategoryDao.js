'use strict';

/**
 * 创建 Category Dao 用来操作 Category Model，实现数据的增删改查等功能
 * @module CategoryDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-19
 * */
function CategoryDao(Model) {
  this.model = Model;
}

var CategoryModel = require('../../models/blog/CategoryModel');
var categoryDao = new CategoryDao(CategoryModel);
var underscore = require('underscore');

module.exports = categoryDao;

/**
 * 保存数据，包括添加和修改
 * 执行后返回所有列表，如果影响性能的话，直接返回其添加或修改的数据
 * @method
 * @param data {CategoryModel} CategoryModel 实例
 * @param callback {function}回调函数
 */
CategoryDao.prototype.save = function (data, callback) {
  var self = this;
  var loginName = data.account;
  if (data._id) {
    var update = {
      name: data.name,
      parent: data.parent === undefined ? null : data.parent,
      description: data.description
    };
    this.model.update({_id: data._id}, update, function (err, numberAffected, rawResponse) {
      if (err) {
        return callback(err);
      } else {
        self.model.find({account: loginName}, {_id: 1, name: 1, parent: 1}).sort({_id: 1})
          .exec(function (err, docs) {
            return callback(err, docs);
          });
      }
    });
  } else {
    var entity = new this.model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      if (err) {
        return callback(err);
      } else {
        self.model.find({account: loginName}, {_id: 1, name: 1, parent: 1}).sort({_id: 1})
          .exec(function (err, docs) {
            return callback(err, docs);
          });
      }
    });
  }
};

/**
 * 返回数据列表
 * @method
 * @param searchContent {String} 搜索内容
 * @param loginName {String} 用户名
 * @param callback {function} 回调函数
 */
CategoryDao.prototype.list = function (searchContent, loginName, callback) {
  var conditions = {account: loginName};
  if (searchContent) {
    var match = new RegExp(searchContent, 'ig');
    underscore.extend(conditions, {
      $or: [
        { name: match } ,
        { description: match }
      ]
    });
  }
  this.model.find(conditions, {_id: 1, name: 1, count: 1, parent: 1}).sort({_id: 1})
    .exec(function (err, docs) {
      return callback(err, docs);
    });
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
CategoryDao.prototype.findById = function (id, callback) {
  this.model.findById(id, function (err, model) {
    return callback(err, model);
  });
};

/**
 * 删除记录
 * 该 方法有问题，主要处理 循环回调的问题，待解决
 * 这里不再删除在文章中引用的该分类
 * 文章中引用的该分类在显示的时候会屏蔽掉
 * 同时如果修改该文章的时候会删掉不存在的标签的
 * @method
 * @param loginName {String} 用户名
 * @param items { Array } 要删除记录数组，包括主键 _id 和 parent
 * @param callback {function} 回调函数
 */
CategoryDao.prototype.delete = function (loginName, items, callback) {
  //要删除数据的条件，例如：{ field: { $n: [<value1>, <value2>, ... <valueN> ] } }
  var ids = [], i, len = items.length, item;
  for (i = 0; i < len; i++) {
    ids.push(JSON.parse(items[i])._id);
  }
  var conditions = { _id: { $in: ids } };

  var model = this.model;
  this.model.remove(conditions, function (err) {
    if (err) {
      return callback(err);
    }
    /*jshint -W083*/
    for (i = 0; i < len; i++) {
      item = JSON.parse(items[i]);
      model.update({parent: item._id}, { parent: item.parent || null }, function (err) {
        if(err){
          return callback(err);
        }
      });
    }
    model.find({account: loginName}, {_id: 1, name: 1, parent: 1}).sort({_id: 1})
      .exec(function (err, docs) {
        return callback(err, docs);
      });
  });
};

/**
 * 根据给定的条件查询记录
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 * @param fields {Object} 显示的列
 */
CategoryDao.prototype.find = function (conditions, callback, fields) {
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
 *  取经常使用的分类目录，默认取前十条
 * @param num
 * @param loginName 用户名
 * @param callback
 */
CategoryDao.prototype.frequentList = function (num, loginName, callback) {
  num = num || 10;//默认为10
  this.model.find({account: loginName, count: { $gt: 0 }}, {_id: 1, name: 1, count: 1}).sort({count: -1}).limit(num)
    .exec(function (err, docs) {
      return callback(err, docs);
    });
};

/**
 * 修改 count 值
 * 添加和修改文章的时候会调用该方法
 * @method
 * @param categories { Array } id 组成的数组
 * @param callback {function} 回调函数
 */
CategoryDao.prototype.updateCount = function (categories, callback) {
  if (underscore.isEmpty(categories)) {
    return callback(null);
  }
  var category;
  /*jshint -W083*/
  for (var i = 0, len = categories.length; i < len; i++) {
    category = categories[i];
    var conditions = {_id: category };
    var update = {$inc: {count: 1}};
    if (underscore.isObject(category)) {
      conditions = {_id: category._id };
      update = {$inc: {count: category.increase ? 1 : -1}};
    }
    this.model.update(conditions, update,
      function (err, numberAffected, rawResponse) {
        if(err){
          return callback(err);
        }
      });
  }

  return callback();
};

/**
 * 当删除文章时，修改引用 category 的count值
 * @param labels{ Array } 要修改的 category 数组
 * @param callback
 */
CategoryDao.prototype.reduceCount = function (categories, callback) {
  var category;
  /*jshint -W083*/
  for(category in categories){
    if(categories.hasOwnProperty(category)){
      this.model.update({_id: category}, {$inc: {count: -categories[category]}}, function (err, numberAffected, rawResponse) {
         if(err){
           return callback(err);
         }
      });
    }
  }
  return callback();
};