'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 文章分类目录 Schema
 * 在命令窗口插入一条记录
 * db.categories.save({"name":"meifenlei",createDate:new Date()})
 * @type {Schema}
 */
var schema = new Schema({
  name: { type: String },
  account: { type: String },//即作者，这里保存账户登录名，登录名是唯一的
  description: { type: String },
  parent: { type: String },
  count: { type: Number, default: 0 },//文章使用次数
  createdDate: { type: Date, default: Date.now }
});

/**
 * 文章分类目录 Model
 * @module CategoryModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */
module.exports = mongodb.model('Category', schema);
