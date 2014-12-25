'use strict';

/**
 * 资源链接 Controller
 * @class ResourceCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-1
 * */

angular.module('hopefutureBlogApp')
  .controller('ResourceCtrl', function ($scope, $location, blogService) {

    var pathname = window.location.pathname;
    var account = pathname.substring(1);

    /**
     * 按分类加载资源链接列表
     */
    blogService.resource(account, function (data) {
      if (data.success === true) {
        $scope.resources = data.resources;
      }
    });

  });