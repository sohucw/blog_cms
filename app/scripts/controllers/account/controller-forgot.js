'use strict';

/**
 * 忘记账户 Controller
 * @class LoginnameCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-4
 * */
angular.module('hopefutureBlogApp')
  .controller('LoginnameCtrl', function ($scope, forgotService) {
    $scope.formToggle = true;
    $scope.account = {email: ''};
    $scope.sendEmail = function () {
      forgotService.sendEmail($scope.account, function (data) {
        if (data.success) {
          $scope.$parent.alerts = [
            {type: 'success', message: '系统成功给您的注册邮箱发送了一份邮件，请查收并获取您的账户。'}
          ];
          $scope.formToggle = false;
        } else {
          $scope.$parent.alerts = [
            {type: 'danger', message: data.errorMessage}
          ];
        }
      });
    };
  })

/**
 * 忘记密码 Controller
 * @class PasswordCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-4
 * */
  .controller('PasswordCtrl', function ($scope, forgotService) {
    $scope.formToggle = true;
    $scope.account = {
      loginName: '',
      email: ''
    };

    $scope.validateEmail = function () {
      if ($scope.account.email !== '' && $('#loginName').valid()) {
        $scope.validator.resetForm();
        $('#email').valid();
      }
    };
    $scope.sendEmail = function () {
      forgotService.sendLoginnameEmail($scope.account, function (data) {
        if (data.success) {
          $scope.$parent.alerts = [
            {type: 'success', message: '系统成功给您的注册邮箱发送了一份邮件，请查收并获取新密码。'}
          ];
          $scope.formToggle = false;
        } else {
          $scope.$parent.alerts = [
            {type: 'danger', message: data.errorMessage}
          ];
        }
      });
    };
  });