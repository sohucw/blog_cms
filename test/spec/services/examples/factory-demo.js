'use strict';

describe('Service: myFactory', function () {

  // load the service's module
  beforeEach(module('hopefutureBlogApp'));

  // instantiate service
  var myFactory;
  beforeEach(inject(function (_myFactory_) {
    myFactory = _myFactory_;
  }));

  it('should do something', function () {
    expect(!!myFactory).toBe(true);
    expect(myFactory.someMethod()).toBe(42);
  });

});