'use strict';

/**
 * 该例子参考：http://www.html-js.com/article/1912
 * 原文地址：http://blog.codeship.io/2013/08/20/testing-tuesday-19-how-to-test-node-js-applications-with-jasmine.html
 * 安装插件命令：npm install -g jasmine-node
 * 运行命令： jasmine-node spec
 * 需要注意的是要测试文件名应该以 spec（不区分大小写） 结尾，我们也可以通过参数 --match, -m REGEXP 来修改
 * @type {exports}
 */
var calculator = require('../src/calculator');

describe('multiplication', function () {
  it('should multiply 2 and 3', function () {
    var product = calculator.multiply(2, 3);
    expect(product).toBe(6);
  });
});
