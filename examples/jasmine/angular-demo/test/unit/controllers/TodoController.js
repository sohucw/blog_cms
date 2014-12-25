describe('TodoController Test', function () {
  beforeEach(module('todoApp')); // 将会在所有的it()之前运行

  // 我们在这里不需要真正的factory。因此我们使用一个假的factory。
  var mockService = {
    notes: ['note1', 'note2'], //仅仅初始化两个项目
    get: function () {
      return this.notes;
    },
    put: function (content) {
      this.notes.push(content);
    }
  };

  // 现在是真正的东西，测试spec
  it('should return notes array with two elements initially and then add one',
    inject(function ($rootScope, $controller) { //注入依赖项目
      var scope = $rootScope.$new();

      // 在创建控制器的时候，我们也要注入依赖项目
      var ctrl = $controller('TodoController', {$scope: scope, notesFactory: mockService});

      // 初始化的记录应该是2
      expect(scope.notes.length).toBe(2);

      // 输入一个新项目
      scope.note = 'test3';

      // now run the function that adds a new note (the result of hitting the button in HTML)
      // 现在运行这个函数，它将会增加一个新的记录
      scope.createNote();

      // 期待现在的记录数目是3
      expect(scope.notes.length).toBe(3);
    })
  );
});