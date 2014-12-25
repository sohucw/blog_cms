'use strict';

/**
 * 例子： 基本 Grid 列表 Controller
 * @class DemoGridCtrl
 * @since 0.0.2
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-5-9
 * */

angular.module('hopefutureBlogApp')
  .controller('DemoGridCtrl', function ($scope, $modal, demoGridService) {

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
    demoGridService.list(function (data) {
      if (data.success === true) {
        $scope.items = data.items;
      }
    });

    /**
     * 创建新的记录
     * @method DemoGridCtrl.create
     */
    $scope.create = function () {
      openFormModal($modal, $scope);
    };

    $scope.edit = function (id, index) {
      demoGridService.edit(id, function (data) {
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
        demoGridService.delete({params: {ids: [item._id]}}, function (data) {
          if (data.success === true) {
            $('#' + item._id).remove();
            var index = $scope.items.indexOf(item);
            $scope.items.splice(index, 1);
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
        demoGridService.delete(json, function (data) {
          if (data.success === true) {
            var items = [];
            angular.forEach($scope.items, function (item, index) {
              if (item.checked === true) {
                $('#' + item._id).remove();
              } else {
                items.push(item);
              }
            });
            $scope.items = items;
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
              index: index
            };
          }
        }
      });
    }
  })
  .controller('FormModalCtrl', function ($scope, $modalInstance, $timeout, demoGridService, formData) {
    $scope.items = formData.items;
    $scope.demo = {
      _id: undefined,
      title: '',
      publishDate: '',
      content: ''
    };

    //jshint -W106
    $scope.tinymceOptions = {
      height: 250,
      menubar: false, //Disable all menu
      content_css: '/styles/tinymce.css',
      plugins: [
        "autolink link image preview hr code fullscreen table textcolor charmap"
      ],
      toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | styleselect | fontselect fontsizeselect formatselect ' + '| forecolor backcolor removeformat | bullist numlist outdent indent blockquote | alignleft aligncenter alignright alignjustify | ' + 'hr image link unlink | charmap table code preview fullscreen'
    };

    var item = formData.item;
    if (item) {
      $scope.demo = {
        _id: item._id,
        title: item.title,
        content: item.content
      };
    }
    $scope.save = function () {
      demoGridService.save($scope.demo, function (data) {
        if (data.success === true) {
          if (item) {
            angular.extend($scope.items[formData.index], $scope.demo, data.item);
          } else {
            $scope.items.unshift(data.item);
          }
        }
      });
      $modalInstance.close();
    };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
    tinymce.get('content').destroy();
  };

    $timeout(function(){
      $('#dateTimePicker').datetimepicker({
        minDate: new Date()
      });
    },100);
  });