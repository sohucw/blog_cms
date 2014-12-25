'use strict';

/**
 * 用户信息 Controller
 * @class AccountInfoCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-8-2
 * */

angular.module('hopefutureBlogApp')
  .controller('AccountInfoCtrl', function ($scope, $modal, accountInfoService, accountInfo) {

  $scope.account = {
    loginName: '',
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

  accountInfoService.findAccount(function (data) {
    if (data.success === true) {
      angular.extend($scope.account, data.account);
    }
  });

  $scope.update = function () {
    var account = angular.copy($scope.account);
    delete account.loginName;
    delete account.email;
    accountInfoService.update(account, function (data) {
      $modal.open({
        templateUrl: '../views/templates/alert-modal.html',
        controller: 'AlertModalCtrl',
        resolve: {
          config: function () {
            return {
              modalTitle: '提示信息',
              modalContent: data.success === true?'修改用户信息成功！':'修改用户信息失败！'
            };
          }
        }
      });
    });
  };

  //修改密码
  $scope.updatePassword = function () {
    $modal.open({
      backdrop: 'static',// 设置为 static 表示当鼠标点击页面其他地方，modal不会关闭
      //keyboard: false,// 设为false，按 esc键不会关闭 modal
      templateUrl: 'updatePassword.html',
      controller: 'UpdatePasswordCtrl',
      resolve: {// 传递数据
        formData: function () {
          return  {
            loginName: $scope.account.loginName,
            accountScope: $scope
          };
        }
      }
    });
  };
}).controller('UpdatePasswordCtrl', function ($scope, $modalInstance, $timeout, accountInfoService, formData) {
  var accountScope = formData.accountScope;

  $scope.account = {
    loginName: formData.loginName,
    oldPassword: '',
    password: '',
    confirmPassword: ''
  };

  $scope.alerts = [];
  $scope.closeAlert = function (index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.updatePassword = function () {
    var account = angular.copy($scope.account);
    delete account.confirmPassword;
    accountInfoService.updatePassword($scope.account, function (data) {
      if (data.success === true) {
        accountScope.$parent.$parent.alerts = [
          {type: 'success', message: '密码修改成功！'}
        ];
        $modalInstance.close();
        $timeout(function () {
          accountScope.$parent.$parent.alerts = [];
        }, 1000);
      } else {
        $scope.alerts = [
          {type: 'danger', message: data.message}
        ];
      }
      $scope.account.oldPassword = '';
      $scope.account.password = '';
      $scope.account.confirmPassword = '';
    });
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

