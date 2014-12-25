'use strict';

var demoDao = require('./../../dao/examples/DemoDao');
var DataPage = require('../../utils/DataPage');

var pagination = {
  index: function (req, res) {
    res.render('examples/demo-pagination', {
      title: 'This is a Pagination Example.',
      navTitle: '例子 -> 分页显示Grid'
    });
  },

  paging: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var dataPage = new DataPage(options);
    demoDao.pagination(dataPage, function (err, data) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          dataPage : data
        });
      }
    });
  },

  save: function (req, res) {
    var data = req.body;
    demoDao.savePagination(data, function (err, doc) {
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
    demoDao.findById(id, function (err, model) {
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
    if (Object.prototype.toString.call(ids) !== '[object Array]') {
      ids = [ids];
    }
    var conditions = { _id: { $in: ids } };
    demoDao.delete(conditions, function (err) {
      res.send({success: err === null});
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', pagination.index);
router.get('/paging', pagination.paging);
router.post('/', pagination.save);
router.get('/:id', pagination.edit);
router.delete('/', pagination.delete);

/**
 * 分页显示 路由
 * 该路由中包含了以下 url

 > 1. pagination.index  app.get('/', pagination.index); 显示分页首页
 > 2. pagination.paging app.get('/paging', pagination.paging); 获取分页数据
 > 3. pagination.save app.post('/', pagination.save); 保存数据
 > 4. pagination.edit app.get('/:id', pagination.edit); 编辑数据
 > 5. pagination.delete app.delete('/', pagination.delete); 删除数据（一条或多条）

 注意路由的前缀是由 `app.use('/example-pagination', pagination);` 定义的，即实际访问 url 时在路由前需加上/example-pagination

 * @module pagination
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */

module.exports = router;