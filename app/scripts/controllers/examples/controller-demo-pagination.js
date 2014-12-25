'use strict';

angular.module('hopefutureBlogApp')
  .controller('DemoPaginationCtrl', function ($scope, $modal, demoPaginationService) {
    //初始化记录
    $scope.items = [];
    $scope.grid = {
      checked: false
    };

    /**
     * 分页数据
     * FIXME 这里如果定义为 $scope.currentPage = 1，则$scope.currentPage的值始终是1，
     * FIXME 这是 angular的一个 bug，我们可以在外边再包一层，换成 $scope.page = {currentPage: 1};
     * FIXME 这样就不会报错了，当然也可以跟踪 angular ui 的源代码，利用最原始的方法来动态改变 $scope.currentPage 的值，代码如下：
     * FIXME $scope.currentPage = $scope.$$childHead.$$childHead.page; 不建议这样做
     */
    $scope.page = {currentPage: 1};
    $scope.maxSize = 5;
    $scope.itemsPerPage = 2;

    $scope.loadPageData = function () {
      var params = {
        currentPage: $scope.page.currentPage,
        itemsPerPage: $scope.itemsPerPage
      };
      demoPaginationService.paging({params: params}, function (data) {
        if (data.success === true) {
          $scope.items = data.dataPage.items;
          $scope.totalItems = data.dataPage.totalItems;
        }
      });
    };

    $scope.loadPageData();

    $scope.create = function () {
      openFormModal($modal, $scope);
    };

    $scope.edit = function (id, index) {
      demoPaginationService.edit(id, function (data) {
        openFormModal($modal, $scope, data.item, index);
      });
    };

    $scope.delete = function (item) {
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {};
          }
        }
      });
      modalInstance.result.then(function () {
        demoPaginationService.delete({params: {ids: [item._id]}}, function (data) {
          if (data.success === true) {
            $scope.loadPageData();
          }
        });
      });
    };

    $scope.deleteAll = function () {
      if ($scope.grid.checked === false) {
        $modal.open({
          templateUrl: '../views/templates/alert-modal.html',
          controller: 'AlertModalCtrl',
          resolve: {
            config: function () {
              return {
                modalContent: 'Please select at least one record.'
              };
            }
          }
        });
        return;
      }
      var modalInstance = $modal.open({
        backdrop: 'static',
        templateUrl: '../views/templates/confirm-modal.html',
        controller: 'ConfirmModalCtrl',
        resolve: {
          config: function () {
            return {};
          }
        }
      });
      /**
       * 点击ok和cancel执行的回调
       * modalInstance.result.then(function () {}, function () {});
       */
      modalInstance.result.then(function () {
        var ids = [];
        angular.forEach($scope.items, function (item, index) {
          if (item.checked === true) {
            ids.push(item._id);
          }
        });
        var json = {params: {ids: ids}};
        demoPaginationService.delete(json, function (data) {
          if (data.success === true) {
            $scope.loadPageData();
            $scope.grid.checked = false;
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

    function openFormModal($modal, $scope, item, index) {
      $modal.open({
        backdrop: 'static',// 设置为 static 表示当鼠标点击页面其他地方，modal不会关闭
        //keyboard: false,// 设为false，按 esc键不会关闭 modal
        templateUrl: 'demoModalContent.html',
        controller: 'FormModalCtrl',
        windowClass: 'h-grid-modal',
        resolve: {// 传递数据
          formData: function () {
            return  {
              items: $scope.items,
              item: item,
              index: index,
              loadPageData: $scope.loadPageData
            };
          }
        }
      });
    }
  })
  .controller('FormModalCtrl', function ($scope, $modalInstance, $timeout, demoPaginationService, formData) {
    $scope.items = formData.items;
    $scope.loadPageData = formData.loadPageData;
    $scope.demo = {
      _id: undefined,
      title: '',
      publishDate: '',
      content: ''
    };
    var item = formData.item;
    if (item) {//修改
      $scope.demo = {
        _id: item._id,
        title: item.title,
        content: item.content
      };
    }
    $scope.save = function () {
      demoPaginationService.save($scope.demo, function (data) {
        if (data.success === true) {
          if (item) {
            angular.extend($scope.items[formData.index], $scope.demo, data.item);
          } else {
            $scope.loadPageData(1);
          }
        }
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $timeout(function () {
      $('#dateTimePicker').datetimepicker({
        minDate: new Date()
      });
    }, 100);
  });