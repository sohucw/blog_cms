'use strict';

var articleDao = require('./../../dao/blog/ArticleDao.js');
var DataPage = require('../../utils/DataPage');
var sessionManage = require('../../utils/sessionManage');
var errorCodes = require('../../utils/errorCodes');

var article = {

  paging: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var loginName = req.baseUrl.split('/')[1];
    var dataPage = new DataPage(options);
    var searchContent = req.query.searchContent;
    
    articleDao.pagination(loginName, searchContent, dataPage, function (err, data) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          dataPage: data
        });
      }
    });
  },

  save: function (req, res) {
    var data = req.body;
    var loginName = req.baseUrl.split('/')[1];
    data.account = loginName;
    articleDao.save(data, function (err, id) {
      if (err) {
        console.error(err);
        res.send({success: false, err: err});
      } else {
        res.send({
          success: true,
          _id: id
        });
      }
    });
  },

  edit: function (req, res) {
    var id = req.params.id;
    articleDao.findById(id, function (err, model) {
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

    var loginName = req.baseUrl.split('/')[1];
    articleDao.delete(loginName, ids, function (err) {
      res.send({success: err === null});
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', article.paging);
router.post('/', article.save);
router.get('/:id', article.edit);
router.delete('/', article.delete);

/**
 * 文章管理路由
 * @module article
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */

module.exports = router;