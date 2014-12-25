'use strict';

/**
 * 我们用 nodejs-demo 中的例子来改装一下
 */
var multiply = function (multiplier1, multiplier2) {
  return multiplier1 * multiplier2;
};

describe('multiplication', function () {
  it('should multiply 2 and 3', function () {
    var product = multiply(2, 3);
    expect(product).toBe(6);
  });
});
