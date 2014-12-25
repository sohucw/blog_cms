'use strict';

/**
 * 该例子比较复杂，对于增删改查，适合端对端（e2e）测试，详见端对端测试
 */
describe('Controller: DemoGridCtrl', function () {

  // load the controller's module
  beforeEach(module('hopefutureBlogApp'));

  var demoGridCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    demoGridCtrl = $controller('DemoGridCtrl', {
      $scope: scope
    });
  }));

  // 我们定义一个模拟的 factory
  var demoGridService = {
    items: [
      {
        _id: 1,
        title: 'Title1',
        content: 'Content1',
        createdDate: '2014-04-18 09:31:51',
        createdBy: 'Linder',
        updatedDate: '2014-04-18 09:31:51',
        updatedBy: 'Linder'
      },
      {
        _id: 2,
        title: 'Title2',
        content: 'Content2',
        createdDate: '2014-04-18 09:31:51',
        createdBy: 'Linder',
        updatedDate: '2014-04-18 09:31:51',
        updatedBy: 'Linder'
      }
    ],
    list: function () {
      return this.items;
    },

    save: function (item) {
      this.items.push(item);
    },
    delete: function () {
      this.items.pop();
    }
  };

  it('测试添加功能',
    inject(function ($rootScope, $controller) { //注入依赖项目
      var scope = $rootScope.$new();

      // 在创建控制器的时候，我们也要注入依赖项目
      var ctrl = $controller('DemoGridCtrl', {$scope: scope, demoGridService: demoGridService});

      scope.items = demoGridService.list();

      // 初始化的记录应该是2
      expect(scope.items.length).toBe(2);

      // 添加一条新的记录
      scope.demo = {
        _id: 3,
        title: 'Title3',
        content: 'Content3',
        createdDate: '2014-04-18 09:31:51',
        createdBy: 'Linder',
        updatedDate: '2014-04-18 09:31:51',
        updatedBy: 'Linder'
      };

      demoGridService.save(scope.demo);

      // 期待现在的记录数目是3
      expect(scope.items.length).toBe(3);
    })
  );

  it('测试删除功能',
    inject(function ($rootScope, $controller) { //注入依赖项目
      var scope = $rootScope.$new();

      // 在创建控制器的时候，我们也要注入依赖项目
      var ctrl = $controller('DemoGridCtrl', {$scope: scope, demoGridService: demoGridService});

      scope.items = demoGridService.list();

      // 初始化的记录应该是3
      expect(scope.items.length).toBe(3);

      demoGridService.delete();

      // 期待现在的记录数目是2
      expect(scope.items.length).toBe(2);
    })
  );
});
