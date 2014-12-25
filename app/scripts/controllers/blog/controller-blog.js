'use strict';

/**
 * 个人博客 Controller
 * @class BlogCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-12
 * */

angular.module('hopefutureBlogApp')
  .controller('BlogCtrl', function ($scope, blogService, blogMethod) {

  /**
   * 创建新的文章
   */
  $scope.createBlog = function () {
    window.location.href = '/' + $scope.loginName + '/manage#/publish';
  };

  /**
   * 管理我的博客
   */
  $scope.manageBlog = function () {
    window.location.href =  '/' + $scope.loginName + '/manage#/articles';
  };

  var pathname = window.location.pathname;
  var account = pathname.substring(1);

  $scope.blog = {
    account: undefined,
    hotArticles: undefined,
    recentArticles: undefined,
    articlesArchive: undefined,
    categories: undefined,
    labels: undefined,
    comments: undefined,
    resources: undefined
  };
  /**
   * 加载博客相关数据
   */
  blogService.blog(account, function (data) {
    if (data.success === true) {
      data.blogData.labels = blogMethod.parseArticleLabel(data.blogData.labels);
      //个人签名
      data.blogData.account.signature = data.blogData.account.signature || '这家伙很懒，没有留下任何个人签名';
      $scope.blog = data.blogData;
    }
  });

});