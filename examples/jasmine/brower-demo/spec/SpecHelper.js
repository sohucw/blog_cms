'use strict';

beforeEach(function () {
  /**
   * 定义一个比较器，比较期望和实际的是否相等
   */
  jasmine.addMatchers({
    toBeBlog: function () {
      return {
        compare: function (actual, expected) {
          var hopeFuture = actual;

          return {
            pass: hopeFuture.currentBlog === expected
          };
        }
      };
    }
  });
});
