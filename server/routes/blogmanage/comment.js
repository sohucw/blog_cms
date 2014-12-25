'use strict';

var commentDao = require('./../../dao/blog/CommentDao');
var DataPage = require('../../utils/DataPage');
var underscore = require('underscore');

var comment = {
  paging: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var dataPage = new DataPage(options);
    var searchContent = req.query.searchContent;
    var loginName = req.baseUrl.split('/')[1];

    commentDao.pagination(dataPage, searchContent, loginName, function (err, data) {
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
    var ids = req.query.ids;// ids is Array
    if (!underscore.isArray(ids)) {
      ids = [ids];
    }
    var conditions = { _id: { $in: ids } };
    commentDao.delete(conditions, function (err) {
      res.send({success: err === null});
    });
  }

};

var express = require('express');
var router = express.Router();

router.get('/', comment.paging);
router.delete('/', comment.delete);

/**
 * 评论路由
 * @module comment
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-30
 * */

module.exports = router;