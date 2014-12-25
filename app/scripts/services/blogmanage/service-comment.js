'use strict';

angular.module('hopefutureBlogApp')
  .factory('commentService', ['hfbHttpService', function (hfbHttpService) {
    return {
      paging: function (data, success) {
        hfbHttpService.get('manage/comment', data).then(success);
      },
      'delete': function (data, success) {
        hfbHttpService.delete('manage/comment', data).then(success);
      }
    };
  }]);

