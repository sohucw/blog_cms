'use strict';

angular.module('hopefutureBlogApp')
  .factory('forgotService', ['hfbHttpService', function (hfbHttpService) {
    return {
      sendEmail: function (data, success) {
        hfbHttpService.post('forgot/send/email', data).then(success);
      },
      sendLoginnameEmail: function (data, success) {
        hfbHttpService.post('forgot/send/loginname/email', data).then(success);
      }
    };
  }]);
