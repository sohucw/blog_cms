'use strict';

angular.module('hopefutureBlogApp')
  .factory('resetPasswordService', ['hfbHttpService', function (hfbHttpService) {
    return {
      update: function (data, success) {
        hfbHttpService.post('/resetpassword', data).then(success);
      }
    };
  }]);
