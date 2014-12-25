'use strict';

angular.module('hopefutureBlogApp')
  .factory('signupService', ['hfbHttpService', function (hfbHttpService) {
    return {
      signup: function (data, success) {
        hfbHttpService.post('signup', data).then(success);
      },
      generateLink: function (accountId, success) {
        hfbHttpService.get('/signup/link/' + accountId).then(success);
      }
    };
  }]);
