'use strict';

/**
 * 创建 Resource Dao 用来操作 ResourceModel，实现数据的增删改查等功能
 * @module ResourceDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-31
 * */
function ResourceDao(Model) {
  this.model = Model;
}

var ResourceModel = require('../../models/blog/ResourceModel');
var ResourceCategoryModel = require('../../models/blog/ResourceCategoryModel');
var resourceDao = new ResourceDao(ResourceModel);

module.exports = resourceDao;

/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {ResourceModel} ResourceModel 实例
 * @param callback {function}回调函数
 */
ResourceDao.prototype.save = function (data, callback) {
  var id = data._id;
  if (id) {
    delete data._id;
    data.updatedDate = new Date();
    this.model.update({_id: id}, data, function (err, numberAffected, rawResponse) {
      return callback(err);
    });
  } else {
    var entity = new this.model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      if (err) {
        return callback(err);
      }

      var _doc = product._doc;
      var doc = {
        _id: _doc._id.toString(),
        categoryId: _doc.categoryId,
        link: _doc.link,
        name: _doc.name
      };

      if (doc.categoryId) {
        ResourceCategoryModel.findById(doc.categoryId, {_id: 1, name: 1}, function (err, model) {
          if (err) {
            return callback(err);
          }
          doc.categoryName = model.name;

          return callback(err, doc);
        });
      } else {
        return callback(err, doc);
      }
    });
  }
};

/**
 * 返回数据列表
 * @method
 * @param loginName {String} 用户账号
 * @param callback {function} 回调函数
 */
ResourceDao.prototype.list = function (loginName, callback) {
  var resourceList = [];
  var categoryList = [];
  var categoriesId = [];
  var promise = this.model.find({account: loginName}, {_id: 1, name: 1, link: 1, categoryId: 1}, {$sort: {categoryId: 1}}).exec();

  promise.then(function (resources) {
    resourceList = resources.map(function (item) {
      var doc = item._doc;
      if (doc.categoryId) {
        categoriesId.push(doc.categoryId);
      }
      return doc;
    });

    return ResourceCategoryModel.find({account: loginName}, {_id: 1, name: 1}).exec();
  }).then(function (resourceCategories) {
    var categoryMap = {};
    categoryList = resourceCategories.map(function (item) {
      var doc = item._doc;
      var _id = doc._id.toString();
      //设置resource记录category name
      if (categoriesId.indexOf(_id) !== -1) {
        categoryMap[_id] = doc.name;
      }
      return doc;
    });

    resourceList.forEach(function (item) {
      item.categoryName = item.categoryId ? categoryMap[item.categoryId] : undefined;
    });

    return callback(null, resourceList, categoryList);
  }).then(null, function (err) {
    return callback(err);
  });
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
ResourceDao.prototype.findById = function (id, callback) {
  this.model.findById(id, {_id: 1, name: 1, link: 1, categoryId: 1, description: 1}, function (err, model) {
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
ResourceDao.prototype.delete = function (conditions, callback) {
  this.model.remove(conditions, function (err) {
    return callback(err);
  });
};

/**
 * 保存资源分类
 * @method
 * @param data {ResourceCategoryModel} ResourceCategoryModel 实例
 * @param callback {function}回调函数
 */
ResourceDao.prototype.saveCategory = function (data, callback) {
  if (data._id) {
    ResourceCategoryModel.update({_id: data._id}, data, function (err, numberAffected, rawResponse) {
      return callback(err);
    });
  } else {
    var entity = new ResourceCategoryModel(data);
    entity.save(function (err, product, numberAffected) {
      if (err) {
        return callback(err);
      }
      var _doc = product._doc;
      var doc = {
        _id: _doc._id.toString(),
        name: _doc.name
      };
      return callback(err, doc);
    });
  }
};


/**
 * 资源链接列表（前端页面显示）
 * @param loginName {String} 账户登录名
 * @param callback {function} 回调函数
 */
ResourceDao.prototype.resourceList = function (loginName, callback) {
  var resourceList = [];
  var promise = this.model.find({account: loginName}, {_id: 1, name: 1, link: 1, categoryId: 1, description: 1}, {$sort: {categoryId: 1}}).exec();

  promise.then(function (resources) {
    resourceList = resources.map(function (item) {
      return item._doc;
    });

    return ResourceCategoryModel.find({account: loginName}, {_id: 1, name: 1}).exec();
  }).then(function (resourceCategories) {
    var categoryMap = {};
    resourceCategories.forEach(function (item) {
      var doc = item._doc;
      categoryMap[doc._id.toString()] = doc.name;
    });
    resourceList.forEach(function (item) {
      item.categoryName = item.categoryId ? categoryMap[item.categoryId] : undefined;
    });

    return callback(null, resourceList);
  }).then(null, function (err) {
    return callback(err);
  });
};

/**
 * 删除资源分类记录
 * 注意：要先修改再删除，如果先删除再修改会报错，不知道为什么？？？
 * @method
 * @param ids { Array } id 数组
 * @param callback {function} 回调函数
 */
ResourceDao.prototype.deleteCategory = function (ids, callback) {
  //先修改属于该分类的资源修改为无分类
  this.model.update({categoryId: {$in: ids}}, {$set: {categoryId: ''}}, function (err, numberAffected, rawResponse) {
    if (err) {
      return callback(err);
    }
    var conditions = { _id: { $in: ids } };
    ResourceCategoryModel.remove(conditions, function (err) {
      return callback(err);
    });
  });
};

/**
 * 根据给定的条件查询资源分类记录
 * @param conditions {Object} 条件
 * @param callback {function} 回调函数
 */
ResourceDao.prototype.findCategory = function (conditions, callback) {
  ResourceCategoryModel.find(conditions, function (err, docs) {
    return callback(err, docs);
  });
};