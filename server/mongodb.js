'use strict';

var mongoose = require('mongoose');
var config = require('./config');// 注意这里需要加上路径 ./ ，如果require('config')是找不到 config 的（会从全局查找）
var mongodb = mongoose.createConnection();

var options = {
  /*jshint -W106 */
  db: { native_parser: true },
  server: { poolSize: 5 },// 创建连接池
  user: config.mongodb.user,
  pass: config.mongodb.pass
};

var host = config.mongodb.host;
var port = config.mongodb.port;
var database = config.mongodb.database;

mongodb.open(host, database, port, options);

/**
 * 当连接出错时的处理
 */

mongodb.on('error', function (err) {
  console.error('connect to %s error: ', err.message);
  //监听 mongomongodb异常后关闭闲置连接
  mongodb.close();
  //当出错时退出，Baidu BEA 会不断的报错，所以应该把此处注解掉
  //process.exit(1);
});

//监听mongodb close event并重新连接
mongodb.on('close', function () {
  mongodb.open(host, database, port, options);
});

/**
 * 当打开数据库的操作
 */
mongodb.once('open', function () {
  //log.success('%s has been connected.', config.connectionUrl);
});

/**
 * mongodb 连接数据库对象
 * @module mongodb
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-8
 * */
module.exports = mongodb;