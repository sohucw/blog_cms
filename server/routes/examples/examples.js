'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('examples/examples');
});

/**
 * 例子路由
 * @module examples
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */
module.exports = router;