'use strict';

angular.module('hopefutureBlogApp')
  .directive('resetPasswordValidator', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        $(element).validate({
          rules: {
            confirmPassword: {
              equalTo: '#password'
            }
          },
          messages: {
            confirmPassword: {
              equalTo: '两次输入的密码不一致'
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.resetPassword();
            });
          }
        });
      }
    };
  });

