'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 博客相关设置 Schema
 * 主要用来初始化博客相关数据、打补丁等信息
 * @type {Schema}
 */
var schema = new Schema({
  optionCode: { type: String },//设置代码项
  optionValue: { type: String },//值
  description: { type: String },//描述
  createdDate: { type: Date, default: Date.now }
});

/**
 * 博客相关数据 Model
 * @module BlogOptionModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-21
 * */
module.exports = mongodb.model('BlogOption', schema);
