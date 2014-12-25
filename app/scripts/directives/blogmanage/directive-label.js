'use strict';

angular.module('hopefutureBlogApp')
  .directive('labelValidator', function ($parse) {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        var validator = $(element).validate({
          rules: {
            name: {
              remote: {
                url: 'manage/label/validate/duplicate',
                type: 'get',
                dataType: 'json',
                data: {
                  id: function () {
                    return scope.label._id || '';
                  },
                  name: function () {
                    return scope.label.name;
                  }
                }
              }
            }
          },
          messages: {
            name: {
              remote: '该标签已存在。'
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.save();
            });
          }
        });

        var model = $parse(attrs.labelValidator);
        model.assign(scope, validator);
      }
    };
  })
  .directive('articleCount', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var count = attrs.articleCount;
        if (count > 0) {
          element.html('<a href="">' + count + '</a>');
        } else {
          element.text('0');
        }
      }
    };
  });


