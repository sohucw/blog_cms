'use strict';

describe('Service: demoGridService(测试 demoGridService)', function () {

  // load the service's module
  beforeEach(module('hopefutureBlogApp'));

  // instantiate service
  var demoGridService;
  beforeEach(inject(function (_demoGridService_) {
    demoGridService = _demoGridService_;
  }));

  it('should do something', function () {
    expect(!!demoGridService).toBe(true);
  });

});