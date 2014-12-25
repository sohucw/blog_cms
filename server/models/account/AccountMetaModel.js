'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 账户相关数据 Schema，比如主题等，后续根据业务需求来完善
 * @type {Schema}
 */
var schema = new Schema({
  loginName: { type: String },//用户名，登录名
  theme: { type: String },//主题
  createdDate: { type: Date, default: Date.now }
});

/**
 * 创建账户相关数据 Model
 * @module AccountMetaModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-7
 * */
module.exports = mongodb.model('AccountMeta', schema);
