'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 文章 Schema
 * @type {Schema}
 */
var schema = new Schema({
  title: { type: String },
  content: { type: String },
  account: { type: String },//即作者，这里保存账户登录名，登录名是唯一的
  status: { type: String },//文章状态，如发布，草稿，发布后再修改，延迟发布，回收站等 publish draft modified delay trash
  commentStatus: { type: String },
  publicityStatus: { type: String },//公开度  public: '公开', protected: '密码保护', private: '私密'
  protectedPassword: { type: String },//公开度（密码保护），需输入密码才能查看
  top: {type: Boolean},//文章置顶
  publishType: { type: String },// 发布方式，立即和定时
  publishDate: { type: Date},// 定时发布时间
  articleLink: { type: String },//文章永久链接，取相对地址
  type: { type: String },//文章类型
  categories: { type: Array },//文章所属分类
  labels: { type: Array },//文章标签
  createdMonth: { type: String },//创建的月份，方便文章归档显示
  boutique: {type: Boolean},//是否被推荐到首页显示，由管理员操作
  homeTop: {type: Boolean, default: false },//文章首页置顶，即博客首页，只有管理员才有权限设置
  catalogue: { type: Boolean },//是否生成目录
  catalogueHtml: { type: String },//生成的目录 html
  catalogueContent: { type: String },//带目录的文章内容
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
  readCounts: { type: Number }//浏览总数
});

/**
 * 文章 Model
 * @module ArticleModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */
module.exports = mongodb.model('Article', schema);
