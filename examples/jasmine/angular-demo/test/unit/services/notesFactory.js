describe('notesFactory tests', function () {
  var factory;

  // 在所有it()函数之前运行
  beforeEach(function () {
    // 载入模块
    module('todoApp');

    // 注入你的factory服务
    inject(function (notesFactory) {
      factory = notesFactory;
    });

    var store = {
      todo1: 'test1',
      todo2: 'test2',
      todo3: 'test3'
    };

    spyOn(localStorage, 'getItem').andCallFake(function (key) {
      return store[key];
    });

    spyOn(localStorage, 'setItem').andCallFake(function (key, value) {
      return store[key] = value + '';
    });

    spyOn(localStorage, 'clear').andCallFake(function () {
      store = {};
    });

    spyOn(Object, 'keys').andCallFake(function (value) {
      var keys = [];

      for (var key in store) {
        keys.push(key);
      }

      return keys;
    });
  });

  // 检查是否有我们想要的函数
  it('should have a get function', function () {
    expect(angular.isFunction(factory.get)).toBe(true);
    expect(angular.isFunction(factory.put)).toBe(true);
  });

  // 检查是否返回3条记录
  it('should return three todo notes initially', function () {
    var result = factory.get();
    expect(result.length).toBe(3);
  });

  // 检查是否添加了一条新纪录
  it('should return four todo notes after adding one more', function () {
    factory.put('Angular is awesome');

    var result = factory.get();
    expect(result.length).toBe(4);
  });
});