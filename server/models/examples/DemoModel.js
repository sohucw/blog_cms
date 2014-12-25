'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

var schema = new Schema({
  title: { type: String },
  content: { type: String },
  publishDate: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdBy: String,
  updatedDate: { type: Date, default: Date.now },
  updatedBy: String
});

/**
 * 创建 Demo Model
 * 该 Model 是基于以下 Schema的
 ```
 new Schema({
  title: { type: String },
  content: { type: String },
  createdDate: { type: Date, default: Date.now },
  createdBy: String,
  updatedDate: { type: Date, default: Date.now },
  updatedBy: String
});
 ```
 * @module DemoModel
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */
module.exports = mongodb.model('Demo', schema);
