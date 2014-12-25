/**
 * Created by linder on 2014/8/4.
 */
'use strict';

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailConfig = require('../config').mailConfig;

var templates = {
  forgotLoginName: {
    subject: 'Hope Future Blog - 忘记账户',
    text: '',
    html: '<!DOCTYPE html><html><head><title></title></head><body>' +
      '<p>亲爱的{{:loginName}}：</p>' +
      '<p>您好！您的登录账户是：<strong>{{:loginName}}</strong>。请点击以下链接登录 Hope Future Blog，如果没响应，请复制该链接在你的浏览器中打开。</p>' +
      '<p><a target="_blank" href="{{:serverUrl}}">{{:serverUrl}}</a></p>' +
      '<p>注意：该链接有效期为24小时，过期需重新申请</p>' +
      '<p>Hope Future Blog 帐号中心 </p><p>{{:currentDate}}</p>' +
      '</body></html>'
  },
  forgotPassword: {
    subject: 'Hope Future Blog - 忘记密码',
    text: '',
    html: '<!DOCTYPE html><html><head><title></title></head><body>' +
      '<p>亲爱的{{:loginName}}：</p>' +
      '<p>您好！请点击以下链接重置您的密码，如果没响应，请复制该链接在你的浏览器中打开。</p>' +
      '<p><a target="_blank" href="{{:serverUrl}}">{{:serverUrl}}</a></p>' +
      '<p>注意：该链接有效期为24小时，过期需重新申请</p>' +
      '<p>Hope Future Blog 帐号中心 </p><p>{{:currentDate}}</p>' +
      '</body></html>'
  },
  activateAccount: {
    subject: 'Hope Future Blog - 激活账号',
    text: '',
    html: '<!DOCTYPE html><html><head><title></title></head><body>' +
      '<p>亲爱的{{:loginName}}：</p>' +
      '<p>您好！请点击以下链接激活你的账号，如果没响应，请复制该链接在你的浏览器中打开。</p>' +
      '<p><a target="_blank" href="{{:serverUrl}}">{{:serverUrl}}</a></p>' +
      '<p>注意：该链接有效期为24小时，过期需重新申请</p>' +
      '<p>Hope Future Blog 帐号中心 </p><p>{{:currentDate}}</p>' +
      '</body></html>'
  }
};

var re = /\{\{:([\w-]+)\}\}/g;
/**
 * 处理模板数据
 * 该方法支持键值即json格式的数据
 * @param template
 * @param values
 * @returns {*}
 */
var applyTemplate = function (template, values) {
  return template.replace(re, function (m, name) {
    return values[name] !== undefined ? values[name] : '';
  });
};

/**
 * 基于 smtpTransport 创建邮件服务器
 */
var transporter = nodemailer.createTransport(smtpTransport({
  host: mailConfig.host,
  port: mailConfig.port,
  auth: {
    user: mailConfig.user,
    pass: mailConfig.pass
  }
}));

// 邮件默认配置项
var mailOptions = {
  from: mailConfig.from, // 发送地址
  to: '', // 接收地址，多个用逗号隔开，比如：bar@blurdybloop.com, baz@blurdybloop.com
  subject: '', // 主题
  text: '', // 文本内容
  html: '' // html 内容
};


var mailer = {
  /**
   * 发送邮件，确保模板和数据一一对应上
   * @param email
   * @param template
   * @param data
   * @param callback
   */
  send: function (email, template, data, callback) {
    template = templates[template];
    mailOptions.to = email;
    mailOptions.subject = template.subject;
    mailOptions.html = applyTemplate(template.html, data);

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Message sent: ' + info.response);
      }
      callback(error);
    });
  }
};

module.exports = mailer;