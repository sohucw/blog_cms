'use strict';

/**
 * 创建 Comment Dao 用来操作 CommentModel，实现数据的增删改查等功能
 * @module CommentDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-25
 * */
function CommentDao(Model) {
  this.model = Model;
}

var CommentModel = require('../../models/blog/CommentModel');
var commentDao = new CommentDao(CommentModel);
var moment = require('moment');
var underscore = require('underscore');

module.exports = commentDao;

/**
 * 发布评论
 * @method
 * @param data {CommentModel} CommentModel 实例
 * @param callback {function}回调函数
 */
CommentDao.prototype.comment = function (data, callback) {
  var model = this.model;
  var promise = model.findOne({articleID: data.articleID, content: data.content, commentator: data.commentator, email: data.email}, {_id: 1}).exec();
  promise.then(function (comment) {
    if (comment) {//评论内容不能重复
      throw new Error('9005');
    }

    //同一篇文章同一个 ip 两次评论间隔不能小于30秒，防止灌水
    //FIXME 关于防止灌水的算法待修改
    var date = moment().add('s', -10).toDate();
    return model.findOne({articleID: data.articleID, ip: data.ip, createdDate: { $gt: date}}, {_id: 1}).exec();
  }).then(function (comment) {
    if (comment) {
      throw new Error('9004');
    }
    var entity = new model(data);
    //当有错误发生时，返回err；product 是返回生成的实体，numberAffected which will be 1 when the document was found and updated in the database, otherwise 0.
    entity.save(function (err, product, numberAffected) {
      if (err) {
        throw err;
      } else {
        var doc = product._doc;
        return callback(err, {
          _id: doc._id,
          commentator: doc.commentator,
          headPortrait: doc.headPortrait,
          content: doc.content,
          createdDate: moment(doc.createdDate).format('YYYY年MM月DD HH:mm:ss')
        });
      }
    });
  }).then(null, function (err) {
    return callback(err);
  });
};


/**
 * 分页显示
 * @method
 * @param dataPage {DataPage} 分页数据
 * @param searchContent {String} 搜索内容
 * @param loginName {String} 用户名
 * @param callback {function} 回调函数
 */
CommentDao.prototype.pagination = function (dataPage, searchContent, loginName, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  var conditions = {account: loginName};
  if (searchContent) {
    var match = new RegExp(searchContent, 'ig');
    underscore.extend(conditions, { $or: [
      { email: match },
      { commentator: match } ,
      { content: match }
    ] });
  }
  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      model.find(conditions, {_id: 1, commentator: 1, email: 1, content: 1}, {skip: skip, limit: limit, sort: {_id: -1}}, function (err, docs) {
        dataPage.setItems(docs);
        return callback(err, dataPage);
      });
    }
  });
};

/**
 * 删除记录
 * @method
 * @param conditions { Object }
 * 要删除数据的条件，例如：{ field: { $n: [<value1>, <value2>, ... <valueN> ] } }
 * @param callback {function} 回调函数
 */
CommentDao.prototype.delete = function (conditions, callback) {
  this.model.remove(conditions, function (err) {
    return callback(err);
  });
};
