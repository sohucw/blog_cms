'use strict';

/**
 * 文章归档 Controller
 * @class ArchiveCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-30
 * */

angular.module('hopefutureBlogApp')
  .controller('ArchiveCtrl', function ($scope, $location, $timeout, blogService) {

    var pathname = window.location.pathname;
    var account = pathname.substring(1);

    /**
     * 加载文章归档列表
     */
    var path = $location.path();
    var month = path.substring(path.lastIndexOf('/') + 1);

    var _month = month.split('-');
    $scope.month = _month[0] + '年' + _month[1] + '月';
    blogService.archive(account, month, function (data) {
      if (data.success === true) {
        $scope.articles = data.articles;
        $timeout(function(){
          SyntaxHighlighter.highlight();
          $scope.showArticleInfo = true;
        },100);
      }
    });

  });