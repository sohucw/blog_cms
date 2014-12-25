'use strict';

var accountDao = require('./../../dao/account/AccountDao');
var moment = require('moment');
var mailer = require('../../utils/mailer');
var encryption = require('../../utils/passwordCrypto').encryption;
var config = require('../../config');
var errorCodes = require('../../utils/errorCodes');

var account = {
  index: function (req, res) {
    res.render('account/forgot', {
      title: '忘记账户/密码'
    });
  },

  /**
   * 校验是否有该注册邮箱
   * @param req
   * @param res
   */
  email: function (req, res) {
    var email = req.query.email;
    var conditions = {email: email};
    accountDao.find(conditions, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.length > 0);
      }
    });
  },

  /**
   * 校验该账户是否存在
   * @param req
   * @param res
   */
  loginname: function (req, res) {
    var loginName = req.query.loginName;
    var conditions = {loginName: loginName};
    accountDao.find(conditions, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.length > 0);
      }
    });
  },

  /**
   * 校验该账户和邮箱是否同时满足
   * @param req
   * @param res
   */
  loginnameEmail: function (req, res) {
    var loginName = req.query.loginName;
    var email = req.query.email;
    var conditions = {loginName: loginName, email: email};
    accountDao.find(conditions, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.length > 0);
      }
    });
  },

  /**
   * 忘记用户名，发送账户
   * @param req
   * @param res
   */
  sendEmail: function (req, res) {
    var email = req.body.email;
    var conditions = {email: email};
    var referer = req.headers.referer,
      baseUrl = req.baseUrl;
    var serverUrl = referer.substring(0,referer.indexOf(baseUrl));

    accountDao.findOne(conditions, function (err, model) {
      if (err) {
        res.send({
          success: false,
          errorMessage: err.message
        });
      } else {
        var loginName = model.loginName;
        var data = {
          loginName: loginName,
          serverUrl: serverUrl + '/login',
          currentDate: moment().format('YYYY年MM月DD HH:mm:ss')
        };
        mailer.send(email, 'forgotLoginName', data, function (err) {
          res.send({
            success: err ? false : true,
            errorMessage: err ? errorCodes['9007'] : undefined
          });
        });
      }
    });
  },

  /**
   * 忘记密码，生成重置链接在发送到注册邮箱中
   * @param req
   * @param res
   */
  sendLoginnameEmail: function (req, res) {
    var loginName = req.body.loginName;
    var email = req.body.email;
    var conditions = {loginName: loginName, email: email};
    var referer = req.headers.referer,
      baseUrl = req.baseUrl;
    var serverUrl = referer.substring(0,referer.indexOf(baseUrl));

    accountDao.findOne(conditions, function (err, model) {
      if (err) {
        res.send({
          success: false,
          errorMessage: err.message
        });
      } else {
        var loginName = model.loginName,
          accountId = model._id,
          time = moment().add('days', 1).valueOf(),
          key = encryption.getKey();

        serverUrl += '/resetpassword/' + encodeURIComponent(encryption.encrypt(key, accountId.toString())) + '?key=' +
          encodeURIComponent(key) + '&time=' + encodeURIComponent(encryption.encrypt(key, time + ''));
        serverUrl = serverUrl.replace(/%/g, config.linkSecret);

        var data = {
          loginName: loginName,
          serverUrl: serverUrl,
          currentDate: moment().format('YYYY年MM月DD HH:mm:ss')
        };
        mailer.send(email, 'forgotPassword', data, function (err) {
          res.send({
            success: err ? false : true,
            errorMessage: err ? errorCodes['9007'] : undefined
          });
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', account.index);
router.get('/validate/email', account.email);
router.get('/validate/loginname', account.loginname);
router.get('/validate/loginname/email', account.loginnameEmail);
router.post('/send/email', account.sendEmail);
router.post('/send/loginname/email', account.sendLoginnameEmail);

module.exports = router;