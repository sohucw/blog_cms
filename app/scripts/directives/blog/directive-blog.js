'use strict';

angular.module('hopefutureBlogApp').directive('commentValidator', function ($parse) {
  return {
    restrict: 'AC',
    link: function postLink(scope, element, attrs) {
      var validator = $(element).validate();
      var model = $parse(attrs.commentValidator);
      model.assign(scope, validator);
    }
  };
})
  .directive('scrollTop', function () {
    return {
      restrict: 'AC',
      link: function (scope, element) {
        //jQuery平滑回到顶端效果
        $('html, body').animate({
          scrollTop: 0
        }, {
          duration: 200,
          easing: 'swing'
        });
      }
    };
  })
  //返回到页面顶部
  .directive('backToTop', function () {
    return {
      restrict: 'AC',
      link: function (scope, element) {
        $(element).click(function(e) {
          //jQuery平滑回到顶端效果
          $('html, body').animate({
            scrollTop: 0
          }, {
            duration: 200,
            easing: 'swing'
          });
        });
        //动态显示回到顶部按钮
        var currentScrollTop = 0;
        var hideUpward;
        $(window).scroll(function(e) {
          var scrollTop = $(this).scrollTop();
          $(element)[currentScrollTop > scrollTop && scrollTop > 0 ? 'show' : 'hide']();
          currentScrollTop = scrollTop;
          if (hideUpward) {
            clearTimeout(hideUpward);
          }
          hideUpward = setTimeout(function() {
            $(element).hide();
          }, 60000);
        });
      }
    };
  });

