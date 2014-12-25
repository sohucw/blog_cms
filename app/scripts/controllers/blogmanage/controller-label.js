'use strict';

/**
 * 标签 Controller
 * @class LabelCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-11
 * */

angular.module('hopefutureBlogApp')
  .controller('LabelCtrl', function ($scope, $modal, $timeout, labelService, errorCodes) {

    $scope.label = {
      _id: undefined,
      name: '',
      description: ''
    };
    $scope.index = undefined;

    $scope.labelFormTitle = '添加标签';

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

    $scope.page = {currentPage: 1};
    $scope.maxSize = 5;
    $scope.itemsPerPage = 20;

    $scope.loadPageData = function () {
      var params = {
        currentPage: $scope.page.currentPage,
        itemsPerPage: $scope.itemsPerPage
      };
      if ($scope.searchContent) {
        params.searchContent = $scope.searchContent;
      }

      labelService.paging({params: params}, function (data) {
        if (data.success === true) {
          $scope.items = data.dataPage.items;
          $scope.totalItems = data.dataPage.totalItems;
        }
      });
    };
    $scope.loadPageData();

    $scope.search = function () {
      $scope.loadPageData();
    };

    $scope.create = function () {
      $scope.labelFormTitle = '添加标签';
      angular.element('#labelFormPanel').removeClass('form-editor-panel');
      $scope.showLabelForm = true;
    };

    $scope.cancel = function () {
      $scope.showLabelForm = false;
      resetForm();
    };

    $scope.edit = function (id, index) {
      $scope.cancel();
      //延迟加载，确保动画效果先隐藏
      $timeout(function(){
        labelService.edit(id, function (data) {
          if (data.success === true) {
            $scope.index = index;
            var item = data.item;
            $scope.label._id = item._id;
            $scope.label.name = item.name;
            $scope.label.description = item.description;

            var offset = angular.element('#' + id).offset();
            angular.element('#labelFormPanel').addClass('form-editor-panel')
              .css({top: offset.top - 10});
            $scope.labelFormTitle = '修改标签 — ' + item.name;
            $scope.showLabelForm = true;
          }
        });
      },500);
    };

    $scope.save = function () {
      labelService.save($scope.label, function (data) {
        if (data.success === true) {
          if ($scope.label._id) {//修改
            angular.extend($scope.items[$scope.index], $scope.label);
          } else {
            $scope.loadPageData();
          }
          $scope.showLabelForm = false;
          resetForm();
        } else {
          $scope.$parent.$parent.alerts = [
            {type: 'danger', message: errorCodes[data.errorCode] || data.errorMessage}
          ];
        }
      });
    };

    /**
     * 包括删除一条或多条记录
     * @param label
     */
    $scope.delete = function (label) {
      var json;
      if (!label) {//没有传参数，表示执行的是删除多条记录
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
        var ids = [];
        angular.forEach($scope.items, function (item, index) {
          if (item.checked === true) {
            ids.push(item._id);
          }
        });
        json = {params: {ids: ids}};
      } else {
        json = {params: {ids: label._id}};
      }
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
        labelService.delete(json, function (data) {
          if (data.success === true) {
            $scope.loadPageData();
            if (!label) {
              $scope.grid.checked = false;
            }
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

    //重置表单
    function resetForm() {
      //清空
      $scope.label = {
        _id: undefined,
        name: '',
        description: ''
      };
      //重置校验器
      $scope.validator.resetForm();
    }
  });
