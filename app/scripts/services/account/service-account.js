'use strict';

angular.module('hopefutureBlogApp')
  .factory('accountService', ['hfbHttpService', function (hfbHttpService) {
    return {
      paging: function (data, success) {
        hfbHttpService.get('manage/account', data).then(success);
      },
      changeAccountStatus: function (data, success) {
        hfbHttpService.post('manage/account/status', data).then(success);
      },
      changeManager:function(data, success){
        hfbHttpService.post('manage/account/manager', data).then(success);
      }
    };
  }]);

