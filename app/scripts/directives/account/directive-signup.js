'use strict';

angular.module('hopefutureBlogApp')
  .directive('signupValidator', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        $(element).validate({
          errorPlacement: function (error, element) {
            if (element.is(':checkbox')) {
              error.insertAfter(element.parent());
            } else {
              error.insertAfter(element);
            }
          },
          rules: {
            loginName: {
              remote: 'signup/validate/duplicate'
            },
            email: {
              remote: 'signup/validate/email'
            },
            confirmPassword: {equalTo: '#password'}
          },
          messages: {
            loginName: {
              remote: '该用户名已被注册，请重新输入！'
            },
            email: {
              remote: '该邮箱已被注册，请重新输入！'
            },
            confirmPassword: {
              equalTo: '两次输入的密码不一致'
            },
            accept: {
              required: '你必须同意注册条款！'
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.signup();
            });
          }
        });
      }
    };
  });