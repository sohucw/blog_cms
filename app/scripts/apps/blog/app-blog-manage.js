'use strict';

/**
 * 创建Angular App
 * @link hopefutureBlogApp
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-13
 * */
angular.module('hopefutureBlogApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'ui.tinymce'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/publish', {//发表文章
        templateUrl: '../views/blogmanage/publish.html',
        controller: 'PublishCtrl'
      })
      .when('/article/:articleId', {//编辑文章
        templateUrl: '../views/blogmanage/publish.html',
        controller: 'PublishCtrl'
      })
      .when('/articles', {//文章管理
        templateUrl: '../views/blogmanage/articles.html',
        controller: 'ArticleCtrl'
      })
      .when('/category', {//类别管理
        templateUrl: '../views/blogmanage/category.html',
        controller: 'CategoryCtrl'
      })
      .when('/label', {//标签管理
        templateUrl: '../views/blogmanage/label.html',
        controller: 'LabelCtrl'
      })
      .when('/comment', {//评论管理
        templateUrl: '../views/blogmanage/comment.html',
        controller: 'CommentCtrl'
      })
      .when('/resource', {//资源链接
        templateUrl: '../views/blogmanage/resource.html',
        controller: 'ResourceCtrl'
      })
      .when('/setting', {//博客管理
        templateUrl: '../views/blogmanage/setting.html',
        controller: 'SettingCtrl'
      })
      .when('/accountInfo', {//用户信息，用来修改用户信息，密码等
        templateUrl: '../views/account/account-info.html',
        controller: 'AccountInfoCtrl'
      })
      .when('/account', {//用户管理，只有管理员administrator才能操作
        templateUrl: '../views/account/account.html',
        controller: 'AccountCtrl'
      })
      .when('/audit', {//文章审核，只有管理员administrator才能操作
        templateUrl: '../views/blogmanage/audit.html',
        controller: 'AuditCtrl'
      })
      .otherwise({
        redirectTo: '/article'
      });
    //$locationProvider.html5Mode(true);
  }]);
