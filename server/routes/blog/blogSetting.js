'use strict';

var blogOptionDao = require('./../../dao/blog/BlogOptionDao');

var blogSetting = {
  init: function (req, res) {
    blogOptionDao.findByCode('init_data', function (err) {
      if (err) {
        res.send('<h1>非法操作！</h1>');
      } else {
        blogOptionDao.initData(function (err) {
          res.send(err ? '<h1>初始化数据失败！</h1>' : '<h1>初始化数据成功！</h1>');
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/init', blogSetting.init);

module.exports = router;