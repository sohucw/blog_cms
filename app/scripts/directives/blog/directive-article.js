'use strict';

angular.module('hopefutureBlogApp').directive('protectedValidator', function () {
  return {
    restrict: 'AC',
    link: function postLink(scope, element, attrs) {
      $(element).validate({
        rules: {
          protectedPassword: {
            remote: {
              url: scope.account + '/article/' + scope.articleId + '/password',
              type: 'get',
              dataType: 'json'
            }
          }
        },
        messages: {
          protectedPassword: {
            remote: '你输入的密码错误！'
          }
        },
        submitHandler: function () {
          scope.$apply(function () {
            scope.viewArticle();
          });
        }
      });
    }
  };
})//用来统一显示文章相关数据，评论数 标签，分类等
  .directive('articleMeta', function () {
    return {
      restrict: 'AC',
      templateUrl: 'views/templates/article-meta.html',
      link: function (scope, element) {
      }
    };
  })//用来处理文章目录指令
  .directive('generateCatalogue', ['$timeout', 'scrollSpy', function ($timeout, scrollSpy) {
    return {
      restrict: 'AC',
      link: function (scope, element) {
        var catalogueHtml = scope.article.catalogueHtml;//目录
        var catalogueContent = scope.article.catalogueContent;//内容
        var html = '<div class="article-content">';
        html += catalogueContent + '</div>';
        html += '<div class="article-catalogue-panel sr-only">';
        html += '<div class="article-catalogue-header"><span class="glyphicon glyphicon-list"></span></div>';
        html += '<div class="article-catalogue">';
        html += catalogueHtml;
        html += '<div class="article-catalogue-arrow" style="display: none;"><div class="up disabled"><span class="glyphicon glyphicon-chevron-up"></span></div>' +
          '<div class="down"><span class="glyphicon glyphicon-chevron-down"></span></div></div>';
        html += '</div>';
        element.append(html);

        //添加滚动事件，动态显示文章目录
        $(window).off('scroll.catalogue').on('scroll.catalogue', function () {
          var $aside = $('.article-aside-panel');
          var contentBottom = $aside.offset().top + $aside.outerHeight();
          var scrollTop = $(window).scrollTop();
          var $catalogue = $('.article-catalogue-panel');
          if (scrollTop + 70 > contentBottom) {
            $catalogue.removeClass('sr-only');
          } else {
            $catalogue.addClass('sr-only');
            $catalogue.find('.nav').show();
          }
        });

        //点击栏目图标事件
        element.find('.article-catalogue-header span').click(function (e) {
          $(e.target).parent().next().toggle();
        });

        var $upElement = $('.article-catalogue-arrow .up',element);
        var $downElement = $('.article-catalogue-arrow .down',element);

        var $navElement = $('.article-catalogue > .nav', element);
        var $rowElements = $navElement.find('li > a');

        //The first visible row element index.
        var rowIndex;
        //The visible row element size
        var visibleRowSize;
        //All of li element size;
        var rowSize;
        // Each of row default height
        var rowHeight = 30;

        function fadeInOutUp(step) {
          $downElement.removeClass('disabled');
          if ($upElement.hasClass('disabled')) {
            return;
          }
          step = step || 1;
          rowIndex = rowIndex - step;
          $navElement.css({
            top: -30 * rowIndex
          });
          if (rowIndex <= 0) {
            $upElement.addClass('disabled');
          }
        }

        function fadeInOutDown(step) {
          if(rowIndex === undefined || visibleRowSize === undefined || rowSize === undefined){
            rowIndex = 0;
            visibleRowSize = 0;
            rowSize = 0;
            var menuHeight = $('.article-catalogue',element).outerHeight();
            var subHeight = 0;

            $rowElements.each(function(index, element) {
              var height = $(this).outerHeight();
              subHeight += height;
              rowSize +=  height / rowHeight;
              if (subHeight <= menuHeight) {
                visibleRowSize += height / rowHeight;
              }
            });

            if (visibleRowSize === rowSize) {
              $downElement.addClass('disabled');
            }
          }
          $upElement.removeClass('disabled');
          if ($downElement.hasClass('disabled')) {
            return;
          }
          step = step || 1;
          rowIndex = rowIndex + step;
          $navElement.css({
            top: -30 * rowIndex
          });
          if (rowIndex + visibleRowSize >= rowSize) {
            $downElement.addClass('disabled');
          }
        }

        function wheelFn(e) {
          e.preventDefault();
          e.stopPropagation();
          var originalEvent = e.originalEvent;
          var upDown;
          if (originalEvent.detail) {
            var detail = originalEvent.detail;
            if (detail < 0) { //up
              upDown = 'up';
            } else if (detail > 0) { //down
              upDown = 'down';
            }
          } else if (originalEvent.wheelDelta) { //IE 6 7 8
            var wd = originalEvent.wheelDelta;
            if (wd > 0) { //up
              upDown = 'up';
            }
            if (wd < 0) { //down
              upDown = 'down';
            }
          }
          if (upDown === 'up') {
            if ($upElement.hasClass('disabled')) {
              return;
            }
            fadeInOutUp();
          } else {
            if ($downElement.hasClass('disabled')) {
              return;
            }
            fadeInOutDown();
          }
        }

        // compatibility: mouse wheel event
        // http://www.w3help.org/zh-cn/causes/SD9015
        var ua = navigator.userAgent;
        // ie 11 /gecko/i.test(ua) value is true ,so need to judge /firefox/i.test(ua)
        if (/gecko/i.test(ua) && !/webkit/i.test(ua) && /firefox/i.test(ua)) {//Firefox
          $(document).off('DOMMouseScroll.catalogue').on('DOMMouseScroll.catalogue', '.article-catalogue .nav', wheelFn);
        } else {//IE Safari Chrome Opera
          $(document).off('mousewheel.catalogue').on('mousewheel.catalogue', '.article-catalogue .nav', wheelFn);
        }

        //显示隐藏上下翻滚箭头事件
        element.find('.article-catalogue > ul').mouseenter(function (e) {
          if (visibleRowSize !== rowSize) {
            element.find('.article-catalogue-arrow').show();
          }
        }).mouseleave(function (e) {
          element.find('.article-catalogue-arrow').hide();
        });
        element.find('.article-catalogue-arrow').mouseenter(function(e){
          $(e.currentTarget).show();
        });

        // 上下翻滚栏目事件
        element.on('click','.article-catalogue-arrow > div', function (e) {
          var el = $(e.currentTarget);
          if (el.hasClass('disabled')) {
            return;
          }
          if(el.hasClass('up')){
            fadeInOutUp();
          }else{
            fadeInOutDown();
          }
        });

        //加载 scroll组件
        $timeout(function () {
          scrollSpy.loadScroll($('body'), {
            offset: 70,
            target: '.article-catalogue',
            immedLoad: false
          });

          //注册监听事件，当鼠标滑轮移动到活动的target时，触发该事件
          element.on('activate.hf.scrollspy', '.article-catalogue > .nav li', function(e){
            if(!$('.article-catalogue-panel').hasClass('sr-only')){
              var $activeEl = $(e.currentTarget);
              var $nav = $('.article-catalogue', element);
              var sub = $activeEl.offset().top - $nav.offset().top;
              // 在 $nav 高度范围内可见 0 - 420（也就是说 sub 值为 0 - 390 可见），否则隐藏，需要处理显示
              if(sub > 390){
                fadeInOutDown((sub - 390) / 30);
              }else if(sub < 0){
                fadeInOutUp((- sub)/ 30);
              }
            }
          });
        });
      }
    };
  }]);
