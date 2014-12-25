'use strict';

/**
 * 创建Angular App
 * @link hopefutureBlogApp
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-12
 * */
angular.module('hopefutureBlogApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/articles', {//文章列表
        templateUrl: '../views/blog/articles.html',
        controller: 'ArticlesCtrl'
      })
      .when('/article/:articleId', {//文章
        templateUrl: '../views/blog/article.html',
        controller: 'ArticleCtrl'
      })
      .when('/archive/:month', {//文章归档
        templateUrl: '../views/blog/archive.html',
        controller: 'ArchiveCtrl'
      })
      .when('/category/:id', {//文章分类目录
        templateUrl: '../views/blog/category.html',
        controller: 'CategoryCtrl'
      })
      .when('/label/:id', {//标签文章列表
        templateUrl: '../views/blog/label.html',
        controller: 'LabelCtrl'
      })
      .when('/resource', {//资源链接
        templateUrl: '../views/blog/resource.html',
        controller: 'ResourceCtrl'
      })
      .otherwise({
        redirectTo: '/articles'
      });
  }]);