'use strict';

var accountMetaDao = require('./../../dao/account/AccountMetaDao');
var config = require('../../config');

var setting = {

  setTheme: function (req, res) {
    var themeCode = req.params.themeCode;
    var loginName = req.baseUrl.split('/')[1];
    accountMetaDao.setTheme(loginName, themeCode, function (err) {
      if (err) {
        res.send({success: false, err: err});
      } else {
        //同时往cookie中写入
        res.clearCookie('theme');
        res.cookie('theme', themeCode, {maxAge: 365 * 24 * 60 * 60 * 1000});
        res.send({
          success: true
        });
      }
    });
  },
  findTheme: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    accountMetaDao.findTheme(loginName, function (err, themeCode) {
      if(err){
        res.send({
          success: false
        });
      }else{
        res.send({
          success: true,
          theme: themeCode || config.defaultTheme
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.post('/theme/:themeCode', setting.setTheme);
router.get('/theme', setting.findTheme);

/**
 * 博客设置
 * @module setting
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-7
 * */

module.exports = router;