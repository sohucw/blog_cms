'use strict';

describe('Filter: truncate -- 测试过滤器：truncate', function () {
  beforeEach(module('hopefutureBlogApp'));
  it('截取后的字符长度应该是10',
    // 注意函数参数名字的书写，必须是过滤器名+Filter
    inject(function (truncateFilter) {
      expect(truncateFilter('abcdefghijkl', 10).length).toBe(10);
    })
  );

  //另一种写法，首先用 $filter 实例化过滤器
  var truncate;
  beforeEach(inject(function ($filter) {
    truncate = $filter('truncate');
  }));

  it('截取后的字符长度应该是5', function () {
    var text = 'angularjs';
    expect(truncate(text, 5).length).toBe(5);
  });

  it('按字节长度截取，截取后的字符应该是: 按字节长度截取，An', function () {
    var text = '按字节长度截取，Angular过滤器使用。';
    expect(truncate(text, 18, true)).toBe('按字节长度截取，An');
  });

  it('按字节长度截取，截取后的字符应该是: 按字节长度截取，Angular过滤器使用。', function () {
    var text = '按字节长度截取，Angular过滤器使用。';
    expect(truncate(text, 35, true)).toBe('按字节长度截取，Angular过滤器使用。');
  });

  it('混合截取双字节和单字节，截取后的字符应该是: a你好b你', function () {
    var text = 'a你好b你好cdef，混合截取双字节和单字节';
    expect(truncate(text, 7, true)).toBe('a你好b你');
  });

  it('截取字符串，特殊情况的处理，截取后的字符应该是: 你', function () {
    var text = '你好b你好cdef，混合截取双字节和单字节';
    expect(truncate(text, 1, true)).toBe('你');
  });
});