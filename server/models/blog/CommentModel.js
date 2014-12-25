'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 文章评论 Schema
 * @type {Schema}
 */
var schema = new Schema({
  articleID: { type: String },
  account: { type: String },//文章作者
  commentator: { type: String },//评论者，如果用户已登录，取其登录名
  accountID: { type: String },//评论者Id，如果用户已登录，取其Id，否则为空
  headPortrait: {type: String},//评论者头像，可动态的从评论者中取，如果动态取影响性能，则直接从该字段中取，这样评论者修改了头像，不能确保其头像正确性
  email: { type: String },//评论者邮箱，同样用户已登录，取其邮箱
  ip: { type: String },//评论者IP
  site: { type: String },//评论者个人站点或个人博客
  content: { type: String },//评论内容
  browserAgent: { type: String },//评论者 浏览器 Agent
  commentParent: { type: String },//所属父评论
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

/**
 * 文章评论 Model
 * @module CommentModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */
module.exports = mongodb.model('Comment', schema);
