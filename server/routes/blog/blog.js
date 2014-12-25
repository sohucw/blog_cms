'use strict';

var articleDao = require('./../../dao/blog/ArticleDao');
var DataPage = require('../../utils/DataPage');

/**
 * 首页博客相关route
 *
 */
var blog = {
  boutiqueArticle: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var dataPage = new DataPage(options);

    articleDao.boutiqueArticle(dataPage, function (err, data) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          dataPage: data
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', blog.boutiqueArticle);//首页精品文章

module.exports = router;