'use strict';

(function () {
  var onkeyup = $.validator.defaults.onkeyup;
  $.validator.setDefaults({
    //延迟校验
    onfocusout: function (e) {
      setTimeout(function () {
        $(e).valid();
      }, 150);
    },
    //重新实现onkeyup事件，当远程校验时，按下按键不触发该事件
    onkeyup: function (element, event) {
      var rules = $(element).rules();
      for (var rule in rules) {
        if (rule === 'remote') {
          return;
        }
      }
      onkeyup.call(this, element, event);
    },
    // For the invisible tags, we need to validate too.
    ignore: 'input[type="hidden"], :button, :hidden',
    errorClass: 'text-danger'
  });

  // 以下自定义校验规则
  var customMethod = {
    maxbyteslength: {
      message: '输入内容不能超过{0}个字节，一个汉字等于两个字节。',
      fn: function (value, element, param) {
        return this.optional(element) || value.replace(/[^\x00-\xFF]/g, '**').length <= param;
      }
    },
    validateloginname: {
      message: '用户名只能由字母、数字以及符号（_ . @ -）组成',
      fn: function (value, element, param) {
        return !value || /^[a-zA-Z\d_.@-]*$/.test(value);
      }
    },
    passwordstrategy: {
      message: '密码至少是字母、数字或者符号（! @ # $ % ^ & * ( ) .）中的两种组合',
      fn: function(value, element, param) {
        var pattern = /(^[a-zA-Z!@#$%^&*().]+[0-9]+|[0-9]+[a-zA-Z!@#$%^&*().]+[0-9]*$)/;
        return !value || pattern.test(value);
      }
    }
  };

  /**
   * add method to jquery.validator
   * 这里忽略 jshint forin 的验证
   */
  /*jshint -W089 */
  for (var c in customMethod) {
    var method = customMethod[c];
    $.validator.addMethod(c, method.fn, method.message);
  }
}());