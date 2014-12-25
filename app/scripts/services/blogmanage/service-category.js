'use strict';

angular.module('hopefutureBlogApp')
  .factory('categoryService', ['hfbHttpService', function (hfbHttpService) {
    return {
      query: function (data, success) {
        hfbHttpService.get('manage/category/records/query', data).then(success);
      },
      save: function (data, success) {
        hfbHttpService.post('manage/category', data).then(success);
      },
      edit: function (id, success) {
        hfbHttpService.get('manage/category/' + id).then(success);
      },
      'delete': function (data, success) {
        hfbHttpService.delete('manage/category', data).then(success);
      }
    };
  }])
  .factory('categoryMethod', function () {
    // Public API here
    return {
      /**
       * 节点是否是其孩子节点
       * @param item1
       * @param item2
       * @returns {boolean}
       */
      isChild: function (item1, item2) {
        if (!item1 || !item2) {
          return false;
        }
        if (item1._id === item2.parent) {
          return true;
        }
        return false;
      },

      /**
       * 拼接字符串
       * @param count
       * @param str
       * @returns {string}
       */
      joinStr: function (count, str) {
        var result = '';
        for (var i = 0; i < count; i++) {
          result += str;
        }
        return result;
      },

      /**
       * 重新排序，按照所属级别关系排序，属于同一个父节点的放到一起
       * 算法比较复杂，我们借助Collection来处理数组
       * 首先确保数组必须是按级别正序排序的，这个后台已处理
       * 重新排序过程如下：
       * 首先遍历原数组，调用方法 addItem（单独抽象出来，以为其他地方也会用到）
       * 方法 addItem处理过程为
       * 如果没有父节点的话，直接添加到新数组（collection）中
       * 如果有父节点的话，先找到父节点在collection中的位置 index，找到后判断其下一个节点是否也属于该父节点，
       * 属于的话接着往下找，直到找到不属于为止，然后插入该位置处
       */
      sortItems: function (items) {
        var collection = new HopeFuture.Collection(function (o) {
          return o._id;
        });
        for (var i = 0, len = items.length; i < len; i++) {
          this.addItem(angular.copy(items[i]), collection);
        }
        return collection;
      },

      /**
       * 往 collection 中添加item
       * @param item
       * @param collection
       */
      addItem: function (item, collection) {
        var index, parentItem, step, nextItem;
        item.alias = this.joinStr(item.level, ' —') + ' ' + item.name;
        if (item.parent) {
          index = collection.indexOfKey(item.parent);
          parentItem = collection.itemAt(index);
          step = index + 1;
          nextItem = collection.itemAt(step);
          while (this.isChild(parentItem, nextItem)) {
            step++;
            nextItem = collection.itemAt(step);
          }
          collection.insert(step, item);
        } else {
          collection.add(item);
        }
      },

      openFormModal: function ($modal, $scope, item) {
        $modal.open({
          backdrop: 'static',// 设置为 static 表示当鼠标点击页面其他地方，modal不会关闭
          //keyboard: false,// 设为false，按 esc键不会关闭 modal
          templateUrl: 'category.html',
          controller: 'CategoryFormModalCtrl',
          size: 'lg',
          resolve: {// 传递数据
            formData: function () {
              return  {
                item: item,
                items: $scope.items,
                filterObject: $scope.filterObject
              };
            }
          }
        });
      }
    };
  });

