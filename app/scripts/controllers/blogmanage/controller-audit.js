'use strict';

/**
 * 文章审核 Controller
 * @class AuditCtrl
 * @since 0.2.1
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-9-4
 * */

angular.module('hopefutureBlogApp')
  .controller('AuditCtrl', function ($scope, $location, $modal, auditService) {
    //初始化记录
    $scope.items = [];
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
      auditService.paging({params: params}, function (data) {
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


    /**
     * 包括删除一条或多条记录
     * @param item
     */
    $scope.delete = function (item) {
      var json;
      if (!item) {//没有传参数，表示执行的是删除多条记录
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
        json = {params: {ids: [item._id]}};
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
        auditService.delete(json, function (data) {
          if (data.success === true) {
            $scope.loadPageData();
            if (!item) {
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

    /**
     * 改变状态，是否首页显示
     * @param item
     */
    $scope.changeBoutique = function (item) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: item.boutique ? '确定要取消首页显示吗？' : '确定要首页显示吗？'
            };
          }
        }
      });
      modalInstance.result.then(function () {
        auditService.changeBoutique({_id: item._id, boutique: !item.boutique}, function (data) {
          if (data.success === true) {
            item.boutique = !item.boutique;
          }
        });
      });
    };

    /**
     * 是否首页置顶
     * @param item
     */
    $scope.changeHomeTop = function (item) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: item.homeTop ? '确定要取消首页置顶吗？' : '确定要首页置顶吗？'
            };
          }
        }
      });
      modalInstance.result.then(function () {
        auditService.changeHomeTop({_id: item._id, homeTop: !item.homeTop}, function (data) {
          if (data.success === true) {
            item.homeTop = !item.homeTop;
          }
        });
      });
    };

  });
