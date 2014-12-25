'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 资源链接分类 Schema
 * 可以收藏一些实用的资源链接
 * @type {Schema}
 */
var schema = new Schema({
  account: { type: String },//即作者，这里保存账户登录名，登录名是唯一的
  name: { type: String },//名称
  createdDate: { type: Date, default: Date.now }
});

/**
 * 资源链接分类 Schema
 * @module ResourceCategoryModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-31
 * */
module.exports = mongodb.model('ResourceCategory', schema);