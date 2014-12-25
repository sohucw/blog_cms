'use strict';

/**
 * 重置密码 Controller
 * @class ResetPasswordCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-6
 * */
angular.module('hopefutureBlogApp')
  .controller('ResetPasswordCtrl', function ($scope, resetPasswordService) {
    $scope.formToggle = true;
    $scope.account = {
      password: '',
      confirmPassword: ''
    };
    $scope.resetPassword = function () {
      resetPasswordService.update({
        _id: $scope.accountId,
        password: $scope.account.password
      }, function (data) {
        if (data.success) {
          $scope.formToggle = false;
        }else{
          $scope.$parent.alerts = [
            {type: 'error', message: '重置密码错误！'}
          ];
        }
      });
    };
  });