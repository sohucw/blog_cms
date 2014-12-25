'use strict';

var resourceDao = require('./../../dao/blog/ResourceDao');
var underscore = require('underscore');

var resource = {
  list: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];

    resourceDao.list(loginName, function (err, resources, categories) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          items: resources,
          categories: categories
        });
      }
    });
  },

  save: function (req, res) {
    var data = req.body;
    var loginName = req.baseUrl.split('/')[1];
    data.account = loginName;

    resourceDao.save(data, function (err, doc) {
      if (err) {
        console.error(err);
        res.send({success: false, err: err});
      } else {
        res.send({
          success: true,
          item: doc
        });
      }
    });
  },

  edit: function (req, res) {
    var id = req.params.id;
    resourceDao.findById(id, function (err, model) {
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
    var ids = req.query.ids;// ids is Array
    if (!underscore.isArray(ids)) {
      ids = [ids];
    }
    var conditions = { _id: { $in: ids } };
    resourceDao.delete(conditions, function (err) {
      res.send({success: err === null});
    });
  },

  saveCategory: function (req, res) {
    var data = req.body;
    var loginName = req.baseUrl.split('/')[1];

    //除了前台校验重名，后台也需要校验，防止恶意操作
    var name = data.name,
      id = data._id;
    var conditions = {name: name, account: loginName};
    if (id) {
      conditions._id = { $ne: id };
    }
    resourceDao.findCategory(conditions, function (err, models) {
      if (err || models.length > 0) {//重名
        res.send({
          success: false,
          errorCode: '8002'
        });
      } else {
        data.account = loginName;
        resourceDao.saveCategory(data, function (err, doc) {
          if (err) {
            console.error(err);
            res.send({success: false, errorMessage: err.message});
          } else {
            res.send({
              success: true,
              item: doc
            });
          }
        });
      }
    });

  },

  deleteCategory: function (req, res) {
    var ids = req.query.ids;// ids is Array
    if (!underscore.isArray(ids)) {
      ids = [ids];
    }
    resourceDao.deleteCategory(ids, function (err) {
      res.send({success: err === null});
    });
  },

  /**
   * 校验重名
   * @param req
   * @param res
   */
  duplicate: function (req, res) {
    var name = req.query.name,
      _id = req.query._id;
    var loginName = req.baseUrl.split('/')[1];
    var conditions = {name: name, account: loginName};
    if (_id) {
      conditions._id = { $ne: _id };
    }
    resourceDao.findCategory(conditions, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.length === 0);
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', resource.list);
router.post('/', resource.save);
router.get('/:id', resource.edit);
router.delete('/', resource.delete);
router.post('/category', resource.saveCategory);
router.delete('/category', resource.deleteCategory);
router.get('/validate/duplicate', resource.duplicate);

/**
 * 资源链接路由
 * @module comment
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-31
 * */

module.exports = router;