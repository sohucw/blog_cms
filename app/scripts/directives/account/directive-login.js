'use strict';

angular.module('hopefutureBlogApp')
  .directive('loginValidator', function () {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        $(element).validate({
          submitHandler: function () {
            scope.$apply(function () {
              scope.login();
            });
          }
        });
      }
    };
  });