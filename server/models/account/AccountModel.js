'use strict';

var mongoose = require('mongoose');
var mongodb = require('../../mongodb');
var Schema = mongoose.Schema;

/**
 * 账户 Schema
 * 用mongodb 脚本创建，命令如下：
 * db.createCollection("accounts")
 * db.accounts.save({"loginName":"admin","password":"admin1"})
 * @type {Schema}
 */
var schema = new Schema({
  loginName: { type: String },//用户名，登录名，全站唯一
  name: { type: String },//用户别名
  englishName: {type: String},// 英文名字
  sex: {type: String},// 性别
  headPortrait: {type: String},// 头像
  residence: {type: String},// 来至于那里
  position: {type: String},// 职位
  salt: { type: String },//加密密钥
  hash: { type: String },//加密密码
  email: { type: String }, //有效地址，需要发送确认邮件激活
  signature: { type: String},// 我的签名
  site: { type: String },//个人站点或个人博客
  activated: {type: Boolean, default: false },//是否被激活
  manager: {type: Boolean, default: false },//是否是管理员
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now }
});

/**
 * 创建账户 Model
 * @module AccountModel
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-9
 * */
module.exports = mongodb.model('Account', schema);
