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

    articleDao.pagination(null, searchContent, dataPage, function (err, data) {
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


  delete: function (req, res) {
    var isManager = sessionManage.isManager(req);
    if(!isManager){
      res.send({
        success: false,
        errorMessage: errorCodes['9002']
      });
      return;
    }
    var ids = req.query.ids;// ids is Array
    if (Object.prototype.toString.call(ids) !== '[object Array]') {
      ids = [ids];
    }

    var loginName = req.baseUrl.split('/')[1];
    articleDao.delete(loginName, ids, function (err) {
      res.send({success: err === null});
    });
  },

  changeBoutique: function (req, res) {
    var isManager = sessionManage.isManager(req);
    if(!isManager){
      res.send({
        success: false,
        errorMessage: errorCodes['9002']
      });
      return;
    }
    var data = req.body;
    articleDao.update({_id: data._id}, {$set: {boutique: data.boutique}}, function (err) {
      res.send({success: err === null});
    });
  },

  changeHomeTop: function (req, res) {
    var isManager = sessionManage.isManager(req);
    if(!isManager){
      res.send({
        success: false,
        errorMessage: errorCodes['9002']
      });
      return;
    }
    var data = req.body;
    articleDao.update({_id: data._id}, {$set: {homeTop: data.homeTop}}, function (err) {
      res.send({success: err === null});
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', article.paging);
router.delete('/', article.delete);
router.post('/boutique', article.changeBoutique);
router.post('/homeTop', article.changeHomeTop);

/**
 * 文章审核路由
 * @module article
 * @since 0.2.1
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-9-4
 * */

module.exports = router;