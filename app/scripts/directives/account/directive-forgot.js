'use strict';

angular.module('hopefutureBlogApp')
  .directive('forgotLoginnameValidator', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        $(element).validate({
          rules: {
            email: {
              remote: {
                url: 'forgot/validate/email',
                type: 'get',
                dataType: 'json'
              }
            }
          },
          messages: {
            email: {
              remote: '该注册邮箱不存在，请重新输入！'
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.sendEmail();
            });
          }
        });
      }
    };
  })
  .directive('forgotPasswordValidator', function ($parse) {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        var validator = $(element).validate({
          rules: {
            loginName: {
              remote: {
                url: 'forgot/validate/loginname',
                type: 'get',
                dataType: 'json'
              }
            },
            email: {
              remote: {
                url: 'forgot/validate/loginname/email',
                type: 'get',
                dataType: 'json',
                data: {
                  loginName: function () {
                    return scope.account.loginName;
                  }
                }
              }
            }
          },
          messages: {
            loginName: {
              remote: '该账户不存在，请重新输入！'
            },
            email: {
              remote: '注册邮箱不正确，请重新输入！'
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.sendEmail();
            });
          }
        });

        var model = $parse(attrs.forgotPasswordValidator);
        model.assign(scope, validator);
      }
    };
  });

