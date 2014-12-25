'use strict';

angular.module('hopefutureBlogApp')
  .directive('linkActive', ['$location', function ($location) {
    return {
      restict: 'A',
      link: function (scope, element, attrs) {
        scope.location = $location;
        scope.$watch('location.path()', function (pathValue) {
          var currentHash = element.children().attr('ng-href').substring(1);
          if ((pathValue.indexOf('/article') !== -1 && currentHash === '/articles') || pathValue === currentHash) {
            element.addClass(attrs.linkActive);
          } else {
            element.removeClass(attrs.linkActive);
          }
        });
      }
    };
  }]);