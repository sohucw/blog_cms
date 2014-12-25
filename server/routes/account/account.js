'use strict';

var accountDao = require('../../dao/account/AccountDao');
var DataPage = require('../../utils/DataPage');
var sessionManage = require('../../utils/sessionManage');
var errorCodes = require('../../utils/errorCodes');
var underscore = require('underscore');

var account = {
  paging: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var dataPage = new DataPage(options);
    var searchContent = req.query.searchContent;

    accountDao.pagination(dataPage, searchContent, function (err, data) {
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

  changeAccountStatus: function (req, res) {
    var isAdministrator = sessionManage.isAdministrator(req);
    if(!isAdministrator){
      res.send({
        success: false,
        errorMessage: errorCodes['9002']
      });
      return;
    }
    var status = req.body.status;
    var ids = req.body.ids;// ids is Array
    if (!underscore.isArray(ids)) {
      ids = [ids];
    }
    // 过滤掉administrator 和 admin
    var conditions = { _id: { $in: ids }, loginName: { $nin: [ 'administrator', 'admin' ] } };
    accountDao.changeAccountStatus(conditions, status, function (err) {
      res.send({success: err ? false : true});
    });

  },

  findAccount: function (req, res) {
    var _id = sessionManage.getAccountId(req);
    accountDao.find({_id: _id}, function (err, models) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          account: models[0]
        });
      }
    });
  },

  update: function (req, res) {
    var data = req.body;
    var id = data._id;
    //不能修改登录名和注册邮箱，防止非法操作
    delete data.loginName;
    delete data.email;
    delete data._id;
    accountDao.updateById(id, data, function (err) {
      if (err) {
        res.send({success: false, err: err});
      } else {
        res.send({
          success: true
        });
      }
    });
  },


  updatePassword: function (req, res) {
    var data = req.body;
    accountDao.updatePassword(data, function (err) {
      var errorMessage = '';
      var success = false;
      if (err) {
        switch (err) {
          case -1:
            errorMessage = '该用户不存在！请重新输入';
            break;
          case -2:
            errorMessage = '你输入的原密码不正确！请重新输入';
            break;
          default:
            errorMessage = err.message;
        }
      } else {
        success = true;
        sessionManage.clearAccountCookie(res);
      }
      res.send({success: success, errorMessage: errorMessage});
    });
  },

  changeManager: function (req, res) {
    var isAdministrator = sessionManage.isAdministrator(req);
    if(!isAdministrator){
      res.send({
        success: false,
        errorMessage: errorCodes['9002']
      });
      return;
    }
    var data = req.body;
    accountDao.updateById(data._id, {manager: data.manager}, function (err) {
      res.send({success: err === null});
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', account.paging);
router.post('/status', account.changeAccountStatus);
router.get('/info', account.findAccount);
router.post('/', account.update);
router.post('/password', account.updatePassword);
router.post('/manager', account.changeManager);

/**
 * 用户信息路由
 * @module account
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-29
 * */
module.exports = router;