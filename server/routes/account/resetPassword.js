'use strict';

var accountDao = require('./../../dao/account/AccountDao');
var moment = require('moment');
var encryption = require('../../utils/passwordCrypto').encryption;
var config = require('../../config');
var sessionManage = require('../../utils/sessionManage');

var secret = new RegExp(config.linkSecret, 'g');

var resetPassword = {
  /**
   * 重置密码
   * accountId: 账户Id，key: 加密key，time: 过期时间，设置为24小时
   * @param req
   * @param res
   */
  index: function (req, res) {
    var accountId = decodeURIComponent(req.params.accountId.replace(secret, '%'));
    var key = decodeURIComponent(req.query.key.replace(secret, '%'));
    var time = decodeURIComponent(req.query.time.replace(secret, '%'));

    accountId = encryption.decrypt(key, accountId);
    time = encryption.decrypt(key, time);
    var overdue = false;
    if (moment().valueOf() >= parseInt(time)) {//重置密码链接过期
      overdue = true;
    }
    res.render('account/reset-password/index', {
      title: '重置密码',
      accountId: accountId,
      overdue: overdue
    });
  },

  resetPassword: function (req, res) {
    var account = req.body;
    accountDao.resetPassword(account._id, account.password, function (err) {
      if (!err) {
        sessionManage.clearAccountCookie(res);
      }
      res.send({success: err ? false : true});
    });
  }
};

var express = require('express');
var router = express.Router();


router.get('/:accountId', resetPassword.index);
router.post('/', resetPassword.resetPassword);

module.exports = router;