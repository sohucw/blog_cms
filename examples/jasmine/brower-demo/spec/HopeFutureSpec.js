'use strict';

describe('测试类 HopeFuture ', function () {
  var blog;
  var hopeFuture;

  beforeEach(function () {
    blog = new Blog();
    hopeFuture = new HopeFuture('myBlog');
  });

  it('判断是否是一个blog', function () {
    hopeFuture.setBlog(blog);
    expect(hopeFuture.currentBlog).toEqual(blog);

    //demonstrates use of custom matcher
    expect(hopeFuture).toBeBlog(blog);
  });

  describe('求和的单元测试', function () {
    var a, b;
    beforeEach(function () {
      a = 12;
      b = 8;
    });

    it('这个结果应该是 20', function () {
      expect(hopeFuture.add(a, b)).toBe(20);
    });
  });
});
