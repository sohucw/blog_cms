'use strict';

/**
 * 登录 Controller
 * @class LoginCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-9
 * */

angular.module('hopefutureBlogApp')
  .controller('LoginCtrl', function ($scope, $location, $modal, loginService, errorCodes) {

    var url = $location.absUrl();
    var error = url.match(/errorCode=(\w+)/);
    if (error !== null) {
      var modalInstance = $modal.open({
        templateUrl: '../views/templates/alert-modal.html',
        controller: 'AlertModalCtrl',
        resolve: {
          config: function () {
            return {
              hideClose: true,
              modalContent: errorCodes[error[1]]
            };
          }
        }
      });
      modalInstance.result.then(function () {
        $location.$$absUrl = url.replace(/\?errorCode=\w+/, '');
      });
    }
    $scope.account = {
      loginName: '',
      password: '',
      keepSigned: true
    };

    /**
     * 登录
     */
    $scope.login = function () {
      $scope.account.loginName = $('#loginName').val();
      $scope.account.password = $('#password').val();

      loginService.login($scope.account, function (data) {
        if (data.success === true) {
          window.location.href = '/';
        } else {
          //注意这里，对于父 Controller中的赋值，需要加上 $parent
          //如果是取值，直接写 $scope.alerts 就可以了
          $scope.$parent.alerts = [
            {type: 'danger', message: data.message}
          ];
          $('#loginName')[0].focus();
          $scope.account.password = '';
        }
      });
    };
  });