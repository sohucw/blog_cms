'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 记录文章被浏览的次数
 * 根据 ip 来确认其浏览次数
 * @type {Schema}
 */
var schema = new Schema({
  articleID: { type: String },
  ip: { type: String },//浏览者IP
  browserAgent: { type: String }//浏览者 浏览器 Agent
});

/**
 * 记录文章被浏览的次数 Schema
 * @module ArticleReadCountModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-31
 * */
module.exports = mongodb.model('ArticleReadCount', schema);
