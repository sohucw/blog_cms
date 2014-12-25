'use strict';

describe('Directive: demo', function () {

  // load the directive's module
  beforeEach(module('hopefutureBlogApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<demo></demo>');//创建指令
    element = $compile(element)(scope);//编译指令
    expect(element.text()).toBe('this is the demo directive');
  }));
});