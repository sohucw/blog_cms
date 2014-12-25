'use strict';

/**
 * 忘记用户或密码 App
 * @link hopefutureBlogApp
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-4
 * */
angular.module('hopefutureBlogApp', ['ngRoute', 'ngSanitize', 'ui.bootstrap'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/loginname', {
        templateUrl: '../views/account/forgot-login-name.html',
        controller: 'LoginnameCtrl'
      })
      .when('/password', {
        templateUrl: '../views/account/forgot-password.html',
        controller: 'PasswordCtrl'
      })
      .otherwise({
        redirectTo: '/loginname'
      });
  }]);