'use strict';

// 定义一个测试指令
angular.module('hopefutureBlogApp')
  .directive('demo', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the demo directive');
      }
    };
  });