'use strict';

/**
 * 注册 Controller
 * @class SignupCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-16
 * */

angular.module('hopefutureBlogApp')
  .controller('SignupCtrl', function ($scope, signupService, accountInfo) {

    $scope.account = {
      loginName: '',
      password: '',
      email: '',
      name: '',
      englishName: '',
      residence: '',//居住地
      position: '',//职位
      headPortrait: 'head-portrait-default',//头像
      sex: '',
      site: '',
      signature: ''//我的签名
    };

    $scope.residence = accountInfo.residence;//居住地
    $scope.headPortrait = accountInfo.headPortrait;//头像
    $scope.position = accountInfo.position;//职位

    //改变头像
    $scope.changeHeadPortrait = function (event, value) {
      $scope.account.headPortrait = value;
      $(event.currentTarget).parent().addClass('active').siblings().removeClass('active');
    };

    //来自于，性别，职位 下拉框处理
    $scope.selectBox = {
      residence: false,
      sex: false,
      position: false
    };
    $scope.openDropDown = function ($event, type) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.selectBox[type] = !$scope.selectBox[type];
    };

    $scope.showForm = true;
    /**
     * 注册
     */
    $scope.signup = function () {
      $scope.account.loginName = $('#loginName').val();
      $scope.account.password = $('#password').val();
      signupService.signup($scope.account, function (data) {
        if (data.success === true) {
          $scope.showForm = false;
          $scope.registeredEmail = data.account.email;
          $scope.accountId = data.account._id;
        } else {
          //注意这里，对于父 Controller中的赋值，需要加上 $parent
          //如果是取值，直接写 $scope.alerts 就可以了
          $scope.$parent.alerts = [
            {type: 'danger', message: data.errorMessage}
          ];
          $('#loginName')[0].focus();
        }
      });
    };

    $scope.generateLink = function () {
      signupService.generateLink($scope.accountId, function (data) {
        if (data.success === true) {
          $scope.$parent.alerts = [
            {type: 'success', message: '邮件发送成功！请查收获取用户激活链接。'}
          ];
        }
      });
    };
  })
  //账号激活链接已过期Ctrl
  .controller('GenerateLinkCtrl', function ($scope, signupService) {
    $scope.showActivatedInfo = true;
    $scope.generateLink = function () {
      signupService.generateLink($scope.accountId, function (data) {
        if (data.success === true) {
          $scope.$parent.alerts = [
            {type: 'success', message: '新的激活链接已生成，请查收。'}
          ];

          $scope.showActivatedInfo = false;
        }
      });
    };
  });