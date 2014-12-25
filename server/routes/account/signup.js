'use strict';

var accountDao = require('./../../dao/account/AccountDao');
var moment = require('moment');
var mailer = require('../../utils/mailer');
var encryption = require('../../utils/passwordCrypto').encryption;
var config = require('../../config');
var errorCodes = require('../../utils/errorCodes');

var secret = new RegExp(config.linkSecret, 'g');

/**
 * 生成激活账户链接
 * @param req
 * @param model
 * @param callback
 */
function sendEmail(serverUrl, model, callback) {
  var loginName = model.loginName, accountId = model._id, email = model.email, time = moment().add('days', 1).valueOf(), key = encryption.getKey();

  serverUrl += '/signup/activate/' + encodeURIComponent(encryption.encrypt(key, accountId.toString())) + '?key=' + encodeURIComponent(key) + '&time=' + encodeURIComponent(encryption.encrypt(key, time + ''));
  serverUrl = serverUrl.replace(/%/g, config.linkSecret);

  var data = {
    loginName: loginName,
    serverUrl: serverUrl,
    currentDate: moment().format('YYYY年MM月DD HH:mm:ss')
  };
  mailer.send(email, 'activateAccount', data, function (err) {
    callback(err);
  });
}

var account = {
  index: function (req, res) {
    res.locals.signupPage = true;
    res.render('account/signup', {
      title: '注册页面'
    });
  },
  signup: function (req, res) {
    var referer = req.headers.referer, baseUrl = req.baseUrl;
    var serverUrl = referer.substring(0, referer.indexOf(baseUrl));
    var data = req.body;
    //这里需要设置一下激活状态，防止前端恶意发送数据
    data.activated = false;
    accountDao.signup(data, function (err, model) {
      if (err) {
        res.send({
          success: false,
          errorMessage: err.message
        });
      } else {
        sendEmail(serverUrl, model, function (err) {
          res.send({
            success: err ? false : true,
            errorMessage: err ? errorCodes['9006'] : undefined,
            account: {
              _id: model._id,
              email: model.email
            }
          });
        });
      }
    });
  },

  /**
   * 校验重名
   * @param req
   * @param res
   */
  duplicate: function (req, res) {
    var loginName = req.query.loginName;
    //需要过滤掉以下用户
    var filters = config.accountFilters;
    if (filters.indexOf(loginName) !== -1) {
      res.send(false);
      return;
    }
    var conditions = {loginName: loginName};
    accountDao.find(conditions, function (err, models) {
      if (err) {
        res.send(false);
      } else {
        res.send(models.length === 0);
      }
    });
  },

  /**
   * 校验已经注册的邮箱
   * @param req
   * @param res
   */
  email: function (req, res) {
    var email = req.query.email;
    var conditions = {email: email};
    accountDao.find(conditions, function (err, models) {
      if (err) {
        res.send(false);
      } else {
        res.send(models.length === 0);
      }
    });
  },

  /**
   * 激活账号
   * @param req
   * @param res
   */
  activate: function (req, res) {
    var accountId = decodeURIComponent(req.params.accountId.replace(secret, '%'));
    var key = decodeURIComponent(req.query.key.replace(secret, '%'));
    var time = decodeURIComponent(req.query.time.replace(secret, '%'));

    accountId = encryption.decrypt(key, accountId);
    time = encryption.decrypt(key, time);
    var overdue = false;
    if (moment().valueOf() >= parseInt(time)) {//重置密码链接过期
      overdue = true;
    }
    var url = 'account/activate/index';
    if (overdue) {
      res.render(url, {
        title: '激活账号',
        accountId: accountId,
        overdue: overdue
      });
    } else {
      accountDao.updateById(accountId, {activated: true }, function (err) {
        res.render(url, {
          title: '激活账号',
          success: err ? false : true,
          overdue: overdue,
          accountId: accountId
        });
      });
    }
  },

  link: function (req, res) {
    var referer = req.headers.referer, baseUrl = req.baseUrl;
    var serverUrl = referer.substring(0, referer.indexOf(baseUrl));
    var accountId = req.params.accountId;
    accountDao.findOne({_id: accountId}, function (err, model) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        sendEmail(serverUrl, model, function (err) {
          res.send({
            success: err ? false : true,
            errorMessage: err ? err.message : undefined
          });
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', account.index);
router.post('/', account.signup);
router.get('/validate/duplicate', account.duplicate);
router.get('/validate/email', account.email);
router.get('/activate/:accountId', account.activate);
router.get('/link/:accountId', account.link);

module.exports = router;