'use strict';

/**
 * 类别管理 Controller
 * @class CategoryCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */

angular.module('hopefutureBlogApp')
  .controller('CategoryCtrl', function ($scope, $modal, $sce, $filter, categoryService, categoryMethod) {
    /**
     * 列表数据
     * @type {Array}
     */
    $scope.items = [];

    /**
     * 过滤数据
     * @type {Object}
     */
    $scope.filterObject = {
      items: [],
      searchContent: ''
    };

    /**
     * 是否选中全部列表
     * @type {{checked: boolean}}
     */
    $scope.grid = {
      checked: false
    };

    categoryService.query(null, function (data) {
      if (data.success === true) {
        var collection = categoryMethod.sortItems(data.items);
        $scope.items = collection.items;
        $scope.filterObject.items = angular.copy($scope.items);
      }
    });

    /**
     * 搜索
     * 这里只在前端以过滤数据的方式来搜索
     * 如果是从后台动态搜索，需要传递
     * {params: {searchContent: $scope.searchContent}}
     * 可以参考label中的实现，不过以这种方式实现，后台现在的数据解析有问题，待完善
     */
    $scope.search = function () {
      $scope.filterObject.items = $filter('filter')($scope.items, {name: $scope.filterObject.searchContent});
    };

    /**
     * 创建新的记录
     */
    $scope.create = function () {
      categoryMethod.openFormModal($modal, $scope);
    };

    $scope.edit = function (id) {
      categoryService.edit(id, function (data) {
        categoryMethod.openFormModal($modal, $scope, data.item);
      });
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
        var items = [];
        angular.forEach($scope.filterObject.items, function (item, index) {
          if (item.checked === true) {
            items.push({_id: item._id, parent: item.parent});
          }
        });
        json = {params: {items: items}};
      } else {
        json = {
          params: {
            items: {
              _id: item._id,
              parent: item.parent
            }
          }};
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
        categoryService.delete(json, function (data) {
          if (data.success === true) {
            var collection = categoryMethod.sortItems(data.items);
            $scope.items = collection.items;
            $scope.filterObject.items = angular.copy($scope.items);
            $scope.filterObject.searchContent = '';
            $scope.grid.checked = false;
          }
        });
      });
    };

    $scope.selectAll = function () {
      angular.forEach($scope.filterObject.items, function (item, index) {
        item.checked = $scope.grid.checked;
      });
    };

    $scope.selectItem = function () {
      var checked = false;
      angular.forEach($scope.filterObject.items, function (item, index) {
        if (item.checked) {
          checked = true;
          return false;
        }
      });
      $scope.grid.checked = checked;
    };

    /**
     * 这里需要监听 $scope.items ，如果发生变化 $scope.filterItems 也需要变化，同时清空$scope.searchContent
     * 防止新添加或修改的数据被过滤掉而不能显示在页面中
     * 监听对于modal中修改的值有问题
     * 故采取其他方式实现
     */
//    $scope.$watch('items', function (newValue, oldValue) {
//      $scope.filterItems = angular.copy(newValue);
//      $scope.searchContent = '';
//    });
  })
  //这里需要注意的是：此处的 controller 不能命名为 form name + Ctrl，即CategoryFormCtrl，因为会与Angular本身生成的form controller 冲突，
  .controller('CategoryFormModalCtrl', function ($scope, $modalInstance, categoryService, formData, categoryMethod) {
    $scope.items = formData.items;
    $scope.filterObject = formData.filterObject;
    $scope.dialogTitle = '添加分类目录';
    $scope.category = {
      _id: undefined,
      name: '',
      description: '',
      parentCategory: ''
    };
    var item = formData.item;
    if (item) {
      var parentCategory = '';
      for (var i = 0, len = formData.items.length; i < len; i++) {
        if (formData.items[i]._id === item.parent) {
          parentCategory = formData.items[i];
          break;
        }
      }
      $scope.category = {
        _id: item._id,
        name: item.name,
        description: item.description,
        parentCategory: parentCategory
      };
      $scope.dialogTitle = '修改分类目录';
    }

    $scope.save = function () {
      var parentCategory = $scope.category.parentCategory;
      var category = angular.copy($scope.category);
      delete category.parentCategory;
      if (parentCategory) {
        category.parent = parentCategory._id;
      }
      categoryService.save(category, function (data) {
        if (data.success === true) {
          var collection = categoryMethod.sortItems(data.items);
          $scope.items.length = 0;
          $scope.filterObject.items.length = 0;
          $scope.filterObject.searchContent = '';
          angular.forEach(collection.items, function (item, index) {
            $scope.items.push(item);
            $scope.filterObject.items.push(item);
          });

          /**
           * 如果后台返回的是单一记录数据，执行以下代码
           * 此处需要重新排序设置collection
           var collection = $scope.$parent.collection;
           var item = angular.copy(data.item);
           item.alias = categoryMethod.joinStr(item.level, ' —') + ' ' + item.name;
           collection.add(item);
           var items = collection.items.sort(function (x, y) {
              return x.level > y.level;
              });
           collection = categoryMethod.sortItems(items);
           $scope.items.length = 0;
           angular.forEach(collection.items, function (item, index) {
              $scope.items.push(item);
             });
           **/
        }
      });
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.validateName = function () {
      $scope.validator.resetForm();
      $('#name').valid();
      $('#description').valid();
    };
  });
