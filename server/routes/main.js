'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.locals.mainPage = true;
  res.render('main', { title: 'Hope Future 博客' });
});

/**
 * 首页路由
 * @module main
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */
module.exports = router;