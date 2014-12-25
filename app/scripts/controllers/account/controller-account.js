'use strict';

/**
 * 用户管理 Controller
 * @class AccountCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-02
 * */

angular.module('hopefutureBlogApp')
  .controller('AccountCtrl', function ($scope, $modal, accountService) {

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

      accountService.paging({params: params}, function (data) {
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
     * 启用或停用所选用户
     * @param item
     */
    $scope.changeAccountStatus = function (status, item) {
      var items = [];
      var json = {status: status};
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
            items.push(item);
          }
        });
        json.ids = ids;
      } else {
        items.push(item);
        json.ids = item._id;
      }

      if (status === false) {
        var modalInstance = $modal.open({
          backdrop: 'static',
          templateUrl: '../views/templates/confirm-modal.html',
          controller: 'ConfirmModalCtrl',
          resolve: {
            config: function () {
              return {
                modalContent: '确定要停用所选的用户吗？停用后该用户不能登录，但可以访问其个人博客。'
              };
            }
          }
        });
        modalInstance.result.then(function () {
          accountService.changeAccountStatus(json, function (data) {
            if (data.success === true) {
              angular.forEach(items, function (item, index) {
                item.activated = status;
              });
            }
          });
        });
      } else {
        accountService.changeAccountStatus(json, function (data) {
          if (data.success === true) {
            angular.forEach($scope.items, function (item, index) {
              item.activated = status;
            });
          }
        });
      }
    };

    /**
     * 设置，取消用户为管理员
     * @param item
     */
    $scope.changeManager = function(item){
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {
              modalContent: item.manager ? '确定要取消管理员吗？' : '确定要设置为管理员吗？'
            };
          }
        }
      });
      modalInstance.result.then(function () {
        accountService.changeManager({_id: item._id, manager: !item.manager}, function (data) {
          if (data.success === true) {
            item.manager = !item.manager;
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
