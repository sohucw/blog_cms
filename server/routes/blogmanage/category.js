'use strict';

var categoryDao = require('./../../dao/blog/CategoryDao');
var commonMethod = require('./../../utils/commonMethod');
var underscore = require('underscore');

var category = {

  list: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    categoryDao.list(null, loginName, function (err, docs) {
      if (!err) {
        var items = docs.map(function (item) {
          return {
            _id: item._id.toString(),
            name: item.name,
            count: item.count,
            parent: item.parent
          };
        });
        items = commonMethod.setItemLevel(items);
        res.send({
          success: true,
          items: items
        });
      } else {
        res.send({success: false});
      }
    });
  },

  query: function (req, res) {
    var searchContent = req.query.searchContent;
    var loginName = req.baseUrl.split('/')[1];
    categoryDao.list(searchContent, loginName, function (err, docs) {
      if (!err) {
        var items = docs.map(function (item) {
          return {
            _id: item._id.toString(),
            name: item.name,
            count: item.count,
            parent: item.parent
          };
        });
        items = commonMethod.setItemLevel(items);
        res.send({
          success: true,
          items: items
        });
      } else {
        res.send({success: false});
      }
    });
  },

  save: function (req, res) {
    var data = req.body;
    if (underscore.isEmpty(data.name)) {
      res.send({success: false, err: '分类名称不能为空！'});
      return;
    }
    var loginName = req.baseUrl.split('/')[1];
    data.account = loginName;
    categoryDao.save(data, function (err, docs) {
      if (err) {
        console.error(err);
        res.send({success: false, err: err});
      } else {
        var items = docs.map(function (item) {
          return {
            _id: item._id.toString(),
            name: item.name,
            count: item.count,
            parent: item.parent
          };
        });
        items = commonMethod.setItemLevel(items);
        res.send({
          success: true,
          items: items
        });
      }
    });
  },

  edit: function (req, res) {
    var id = req.params.id;
    categoryDao.findById(id, function (err, model) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          item: model
        });
      }
    });
  },

  delete: function (req, res) {
    var items = req.query.items;// items is Array
    if (!underscore.isArray(items)) {
      items = [items];
    }
    var loginName = req.baseUrl.split('/')[1];
    categoryDao.delete(loginName, items, function (err, docs) {
      if (err) {
        console.error(err);
        res.send({success: false, err: err});
      } else {
        var newItems = docs.map(function (item) {
          return {
            _id: item._id.toString(),
            name: item.name,
            count: item.count,
            parent: item.parent
          };
        });
        newItems = commonMethod.setItemLevel(newItems);
        res.send({
          success: true,
          items: newItems
        });
      }
    });
  },

  /**
   * 校验重名
   * @param req
   * @param res
   */
  duplicate: function (req, res) {
    var name = req.query.name,
      parent = req.query.parent === '' ? null : req.query.parent,
      id = req.query.id;
    var loginName = req.baseUrl.split('/')[1];
    var conditions = {name: name, parent: parent, account: loginName};
    if (id) {
      conditions._id = { $ne: id };
    }
    categoryDao.find(conditions, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.length === 0);
      }
    });
  },

  /**
   * 返回常用的分类目录列表
   * @param req
   * @param res
   */
  frequentList: function (req, res) {
    var num = req.params.num;
    var loginName = req.baseUrl.split('/')[1];
    categoryDao.frequentList(num, loginName, function (err, docs) {
      if (!err) {
        res.send({
          success: true,
          items: docs
        });
      } else {
        res.send({success: false});
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', category.list);
router.post('/', category.save);
router.get('/:id', category.edit);
router.delete('/', category.delete);
router.get('/validate/duplicate', category.duplicate);
router.get('/records/frequent', category.frequentList);//常用的分类
router.get('/records/query', category.query);//常用的分类

/**
 * 分类目录路由
 * @module category
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-19
 * */

module.exports = router;