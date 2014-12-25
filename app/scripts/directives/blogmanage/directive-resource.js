'use strict';

angular.module('hopefutureBlogApp')
  .directive('resourceValidator', function ($parse) {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        var validator = $(element).validate({
          submitHandler: function () {
            scope.$apply(function () {
              scope.save();
            });
          }
        });

        var model = $parse(attrs.resourceValidator);
        model.assign(scope, validator);
      }
    };
  });


