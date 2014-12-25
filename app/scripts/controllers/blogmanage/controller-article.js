'use strict';

/**
 * 文章管理 Controller
 * @class ArticleCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */

angular.module('hopefutureBlogApp')
  .controller('ArticleCtrl', function ($scope, $location, $modal, articleService, articleStatus) {
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
      articleService.paging({params: params}, function (data) {
        if (data.success === true) {
          $scope.items = data.dataPage.items;
          angular.forEach($scope.items, function (item, index) {
            item.status = articleStatus[item.status];
          });
          $scope.totalItems = data.dataPage.totalItems;
        }
      });
    };
    $scope.loadPageData();

    $scope.search = function () {
      $scope.loadPageData();
    };

    $scope.create = function () {
      $location.path('/publish');
    };

    $scope.edit = function (id) {
      $scope.$parent.showPublishInfo = false;
      $location.path('/article/' + id);
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
        articleService.delete(json, function (data) {
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

  });
