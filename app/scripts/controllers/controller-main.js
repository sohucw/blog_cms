'use strict';

/**
 * 网站首页 Controller
 * @class MainCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-12
 * */

angular.module('hopefutureBlogApp')
  .controller('MainCtrl', function ($scope, mainService, blogMethod) {
    $scope.currentPage = 1;
    $scope.itemsPerPage = 20;

    $scope.loadPageData = function () {
      var params = {
        currentPage: $scope.currentPage,
        itemsPerPage: $scope.itemsPerPage
      };
      mainService.boutiqueArticle({params: params}, function (data) {
        if (data.success === true) {
          var numPages = parseInt(data.dataPage.totalItems / $scope.itemsPerPage);
          $scope.articles = data.dataPage.items;
          $scope.totalItems = data.dataPage.totalItems;
          $scope.numPages = data.dataPage.totalItems % $scope.itemsPerPage === 0 ? numPages : (numPages + 1);
        }
      });
    };
    $scope.loadPageData();

    //前一页或下一页
    $scope.prevOrNextPage = function (prevOrNext, event) {
      if (prevOrNext === -1) {
        if ($scope.currentPage === 1) {
          return false;
        }
        $scope.currentPage--;
      } else if (prevOrNext === 1) {
        if ($scope.currentPage === $scope.numPages) {
          return false;
        }
        $scope.currentPage++;
      }

      $scope.loadPageData();
      blogMethod.scrollTop();
    };
  });