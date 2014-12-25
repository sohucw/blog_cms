'use strict';

angular.module('hopefutureBlogApp')
  .factory('loginService', ['hfbHttpService', function (hfbHttpService) {
    return {
      login: function (data, success) {
        hfbHttpService.post('login', data).then(success);
      }
    };
  }]);

