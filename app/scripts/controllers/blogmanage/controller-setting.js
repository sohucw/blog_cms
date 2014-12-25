'use strict';

/**
 * 博客设置 Controller
 * @class SettingCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-13
 * */

angular.module('hopefutureBlogApp')
  .controller('SettingCtrl', function ($scope, settingService, blogThemes) {
    $scope.themes = blogThemes;
    var themeMap = {};
    angular.forEach(blogThemes, function (item) {
      themeMap[item.code] = item.name;
    });
    settingService.findTheme(function (data) {
      if (data.success) {
        $scope.currentTheme = themeMap[data.theme];
      }
    });

    $scope.enableTheme = function (themeCode) {
      settingService.setTheme(themeCode, function (data) {
        if (data.success) {
          window.location.reload();
        }
      });
    };
  });
