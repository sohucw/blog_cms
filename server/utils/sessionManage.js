/**
 * Created by linder on 2014/7/17.
 */

'use strict';
var encryption = require('./passwordCrypto').encryption;
var config = require('../config');

/**
 * 用来动态管理 session 数据
 * @type {{setAccountSession: setAccountSession, getAccountSession: getAccountSession, clearAccountSession: clearAccountSession, isLogined: isLogined}}
 */
var sessionManage = {
  /**
   * 设置用户session
   * @param req
   * @param account
   */
  setAccountSession: function (req, account) {
    req.session.account = account;
  },

  /**
   * 返回用户session
   * 统一返回 null
   * @param req
   * @returns {account|*|$scope.account}
   */
  getAccountSession: function (req) {
    if (req.session.account === undefined) {
      return null;
    }
    return req.session.account;
  },

  /**
   * 返回账户id
   * @param req
   * @returns {*}
   */
  getAccountId: function (req) {
    return req.session.account ? req.session.account._id : null;
  },

  /**
   * 清空用户session
   * @param req
   */
  clearAccountSession: function (req) {
    req.session.account = null;
  },

  /**
   * 判断用户是否登录
   * @param req
   * @returns {boolean}
   */
  isLogined: function (req) {
    return req.session.account ? true : false;
  },

  /**
   * 判断用户是否为超级管理员
   * @param req
   * @returns {boolean}
   */
  isAdministrator: function (req) {
    var account = req.session.account;
    return account ? account.loginName === 'administrator' : false;
  },

  /**
   * 判断用户是否为管理员
   * @param req
   * @returns {boolean}
   */
  isManager: function (req) {
    var account = req.session.account;
    return account ? account.manager === true : false;
  },

  setAccountCookie: function (loginName, password, res) {
    /**
     * 不能设置 secure 为 true
     *  Set-Cookie 的 secure 属性就是处理这方面的情况用的，
     *  它表示创建的 cookie 只能在 HTTPS 连接中被浏览器传递到服务器端进行会话验证，
     *  如果是 HTTP 连接则不会传递该信息，所以绝对不会被窃听到
     * @type {{maxAge: number}}
     * maxAge 单位是毫秒
     */
    var options = {maxAge: 365 * 24 * 60 * 60 * 1000};
    var key = encryption.getKey();

    res.cookie('loginName', encryption.encrypt(key, loginName), options);
    res.cookie('password', encryption.encrypt(key, password), options);
    res.cookie('key', key.replace(/=/g, config.cookieSecret), options);
  },
  /**
   * 清空cookie
   * @param res
   */
  clearAccountCookie: function (res) {
    res.clearCookie('loginName');
    res.clearCookie('password');
    res.clearCookie('key');
  },

  /**
   * 判断是否为静态资源请求
   * 这里根据文件后缀来判断，有：html css js eot svg ttf woff png等
   * @param req
   */
  isStaticResource: function (req) {
    var url = req.url;
    if (/.+(\.html|\.js|\.css|\.eot|\.svg|\.ttf|\.woff|\.png)$/.test(url)) {
      return true;
    }
    return false;
  }

};

module.exports = sessionManage;