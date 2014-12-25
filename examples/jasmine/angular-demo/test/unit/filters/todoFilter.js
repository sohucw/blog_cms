describe('filter tests', function () {
  beforeEach(module('todoApp'));
  it('should truncate the input to 10 characters',
    //this is how we inject a filter by appending Filter to the end of the filter name
    inject(function (truncateFilter) {
      expect(truncateFilter('abcdefghijkl', 10).length).toBe(10);
    })
  );
});