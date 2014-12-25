'use strict';

angular.module('hopefutureBlogApp')
  .factory('resourceService', ['hfbHttpService', function (hfbHttpService) {
    return {
      list: function (success) {
        hfbHttpService.get('manage/resource').then(success);
      },
      save: function (data, success) {
        hfbHttpService.post('manage/resource', data).then(success);
      },
      edit: function (id, success) {
        hfbHttpService.get('manage/resource/' + id).then(success);
      },
      'delete': function (data, success) {
        hfbHttpService.delete('manage/resource', data).then(success);
      },
      saveCategory: function (data, success) {
        hfbHttpService.post('manage/resource/category', data).then(success);
      },
      deleteCategory: function (data, success) {
        hfbHttpService.delete('manage/resource/category', data).then(success);
      }
    };
  }])
  .factory('resourceMethod', function () {
    return {
      /**
       * 验证资源分类重名
       * @param $scope
       * @param id
       * @returns {boolean}
       */
      validResourceCategory: function ($scope) {
        var valid = false;
        $.ajax({
          url: 'manage/resource/validate/duplicate',
          mode: 'abort',
          dataType: 'json',
          async: false,
          data: {
            name: $scope.resourceCategory.name,
            _id: $scope.resourceCategory._id
          },
          success: function (response) {
            valid = response === true || response === 'true';
          }
        });
        if (!valid) {
          $scope.$parent.$parent.$parent.alerts = [
            {type: 'danger', message: '该资源分类已存在。'}
          ];
          return false;
        } else {
          $scope.$parent.$parent.$parent.alerts = [];
          return true;
        }
      }
    };
  });

