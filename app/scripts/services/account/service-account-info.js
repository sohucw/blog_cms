'use strict';

angular.module('hopefutureBlogApp')
  .factory('accountInfoService', ['hfbHttpService', function (hfbHttpService) {
    return {
      findAccount: function (success) {
        hfbHttpService.get('manage/account/info').then(success);
      },
      update: function (data, success) {
        hfbHttpService.post('manage/account', data).then(success);
      },
      updatePassword: function (data, success) {
        hfbHttpService.post('manage/account/password', data).then(success);
      }
    };
  }]);

