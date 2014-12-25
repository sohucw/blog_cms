'use strict';

angular.module('hopefutureBlogApp')
  .directive('tinymce', function ($parse, $timeout) {
    return {
      restict: 'EA',
      //priority: 1000,
      link: function (scope, element, attrs) {
        // 初始化富文本
        // http://www.tinymce.com
        /*jshint -W106 */
        $timeout(function () {
          var editor = new tinymce.Editor('content', {
            height: 400,
            menubar: false, //Disable all menu
            content_css: '/styles/tinymce.css',
            plugins: [
              "autolink link image preview hr code fullscreen table textcolor charmap"
            ],
            toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | styleselect | fontselect fontsizeselect formatselect ' +
              '| forecolor backcolor removeformat | bullist numlist outdent indent blockquote | alignleft aligncenter alignright alignjustify | ' +
              'hr image link unlink | charmap table code preview fullscreen',
            init_instance_callback: function (editor) {
              //var content = '设置内容';
              //editor.setContent(content);
            }
            //statusbar : false
          }, tinymce.EditorManager);
          editor.render();
          var model = $parse(attrs.tinymce);
          model.assign(scope, editor);
        }, 100);

        //model.assign(scope.$parent, editor);
      }
    };
  })
  .directive('articleValidator', function ($parse) {
    return {
      restrict: 'AC',
      link: function postLink(scope, element, attrs) {
        var validator = $(element).validate({
          errorPlacement: function (error, el) {
            if (el.is('#publishDate')) {
              error.insertAfter(el.parent());
            } else {
              error.insertAfter(el);
            }
          },
          submitHandler: function () {
            scope.$apply(function () {
              scope.publish();
            });
          }
        });
        var model = $parse(attrs.articleValidator);
        model.assign(scope, validator);
      }
    };
  });


