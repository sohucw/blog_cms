'use strict';

/**
 * 资源链接 Controller
 * @class ResourceCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-31
 * */

angular.module('hopefutureBlogApp')
  .controller('ResourceCtrl', function ($scope, $modal, resourceService) {

    var resource = {
      _id: undefined,
      name: '',
      link: '',//链接
      categoryId: '',//分类
      description: ''
    };

    $scope.resource = angular.copy(resource);

    $scope.index = undefined;

    $scope.resourceFormTitle = '添加资源链接';
    $scope.submitText = '添加';
    /**
     * 列表数据
     * @type {Array}
     */
    $scope.items = [];
    /**
     * 是否选中全部列表
     * @type {{checked: boolean}}
     */
    $scope.grid = {
      checked: false
    };

    /**
     * 返回列表
     */
    resourceService.list(function (data) {
      if (data.success === true) {
        $scope.items = data.items;
        $scope.categories = data.categories;
      }
    });


    $scope.edit = function (id, index) {
      $scope.index = index;
      resourceService.edit(id, function (data) {
        if (data.success === true) {
          var item = data.item;
          $scope.resource = {
            _id: item._id,
            name: item.name,
            link: item.link,
            categoryId: item.categoryId,
            description: item.description
          };

          $scope.resourceFormTitle = '修改资源链接 — ' + item.name;
          $scope.submitText = '修改';
          $scope.editStatus = true;
          $scope.validator.resetForm();
        }
      });
    };

    //取消编辑
    $scope.cancelEdit = function () {
      $scope.resourceFormTitle = '添加资源链接';
      $scope.submitText = '添加';
      $scope.editStatus = false;
      $scope.resource = angular.copy(resource);
      $scope.validator.resetForm();
    };

    $scope.save = function () {
      resourceService.save($scope.resource, function (data) {
        if (data.success === true) {
          if ($scope.resource._id) {//修改
            angular.extend($scope.items[$scope.index], $scope.resource);
          } else {
            $scope.items.unshift(data.item);
          }
          $scope.cancelEdit();
        }
      });
    };

    /**
     * 包括删除一条或多条记录
     * @param item
     */
    $scope.delete = function (item) {
      var ids;
      if (!item) {//没有传参数，表示执行的是删除多条记录
        ids = [];
        if ($scope.grid.checked === false) {
          $modal.open({
            templateUrl: '../views/templates/alert-modal.html',
            controller: 'AlertModalCtrl',
            resolve: {
              config: function () {
                return {
                  modalContent: '请至少选择一条记录！'
                };
              }
            }
          });
          return;
        }
        angular.forEach($scope.items, function (item, index) {
          if (item.checked === true) {
            ids.push(item._id);
          }
        });
      } else {
        ids = [item._id];
      }
      var json = {params: {ids: ids}};

      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: '确定要删除所选的记录吗？'
            };
          }
        }
      });
      modalInstance.result.then(function () {
        resourceService.delete(json, function (data) {
          if (data.success === true) {
            var idsMap = {};
            var i, len;
            for (i = 0, len = ids.length; i < len; i++) {
              idsMap[ids[i]] = true;
            }
            for (i = $scope.items.length - 1; i >= 0; i--) {
              if (idsMap[$scope.items[i]._id]) {
                $scope.items.splice(i, 1);
              }
            }
            if (!item) {
              $scope.grid.checked = false;
            }

            $scope.cancelEdit();
          }
        });
      });
    };

    $scope.selectAll = function () {
      angular.forEach($scope.items, function (item, index) {
        item.checked = $scope.grid.checked;
      });
    };

    $scope.selectItem = function () {
      var checked = false;
      angular.forEach($scope.items, function (item, index) {
        if (item.checked) {
          checked = true;
          return false;
        }
      });
      $scope.grid.checked = checked;
    };
  })
  .controller('ResourceCategoryCtrl', function ($scope, $modal, resourceService, resourceMethod, errorCodes) {
    $scope.resourceCategory = {
      _id: undefined,
      name: ''
    };
    $scope.categoryIndex = undefined;

    $scope.$watch('resourceCategory.name', function (newValue) {
      if (newValue !== '') {
        $scope.$parent.$parent.$parent.alerts = [];
      }
    });

    $scope.addCategory = function () {
      if ($scope.resourceCategory.name === '') {
        $scope.$parent.$parent.$parent.alerts = [
          {type: 'danger', message: '资源分类名称不能为空！'}
        ];
        return;
      } else {
        if (!resourceMethod.validResourceCategory($scope)) {
          return;
        }
      }

      resourceService.saveCategory($scope.resourceCategory, function (data) {
        if (data.success === true) {
          $scope.$parent.categories.push(data.item);
          $scope.resourceCategory = {
            _id: undefined,
            name: ''
          };
        } else {
          $scope.$parent.$parent.$parent.alerts = [
            {type: 'danger', message: errorCodes[data.errorCode] || data.errorMessage}
          ];
        }
      });
    };

    $scope.editCategory = {
      _id: undefined,
      name: ''
    };

    $scope.updateCategory = function (category, index, event) {
      $scope.editCategory._id = category._id;
      $scope.editCategory.name = category.name;
      $scope.categoryIndex = index;
      $scope.editCategoryStatus = true;

      var position = $(event.currentTarget).position();
      var left = position.left;
      var containerW = $('#editCategoryPanel').parent().width();
      if (left + 240 > containerW) {
        left = containerW - 240;
      }

      $('#editCategoryPanel').css({
        top: position.top - 5,
        left: left
      });
    };

    $scope.cancelCategory = function (category) {
      $scope.editCategory = {
        _id: undefined,
        name: ''
      };
      $scope.editCategoryStatus = false;
    };

    $scope.saveCategory = function (category) {
      if ($scope.editCategory.name === '') {
        return;
      }
      resourceService.saveCategory($scope.editCategory, function (data) {
        if (data.success === true) {
          $scope.$parent.categories[$scope.categoryIndex].name = $scope.editCategory.name;
          $scope.editCategory = {
            _id: undefined,
            name: ''
          };
          $scope.editCategoryStatus = false;
        } else {
          $scope.$parent.$parent.$parent.alerts = [
            {type: 'danger', message: errorCodes[data.errorCode] || data.errorMessage}
          ];
        }
      });
    };

    $scope.deleteCategory = function (category, index) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: '删除后，属于该分类的资源会自动修改为无分类，确定要删除吗？'
            };
          }
        }
      });

      modalInstance.result.then(function () {
        var json = {params: {ids: category._id}};
        resourceService.deleteCategory(json, function (data) {
          if (data.success === true) {
            $scope.$parent.categories.splice(index, 1);
          }
        });
      });
    };
  });
