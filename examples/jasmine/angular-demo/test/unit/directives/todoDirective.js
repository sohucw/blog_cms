describe('directive tests',function(){
    beforeEach(module('todoApp'));
    it('should set background to rgb(128, 128, 128)',
    inject(function($compile,$rootScope) {
      scope = $rootScope.$new();

      // 获得一个元素
      elem = angular.element('<span custom-color="rgb(128, 128, 128)">sample</span>');

      // 创建一个新的自作用域
      scope = $rootScope.$new();

      // 最后编译HTML
      $compile(elem)(scope);

      // 希望元素的背景色和我们所想的一样
      expect(elem.css('background-color')).toEqual('rgb(128, 128, 128)');
     })
  );
});