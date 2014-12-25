'use strict';

angular.module('hopefutureBlogApp')
  .factory('labelService', ['hfbHttpService', function (hfbHttpService) {
    return {
      paging: function (data, success) {
        hfbHttpService.get('manage/label', data).then(success);
      },
      save: function (data, success) {
        hfbHttpService.post('manage/label', data).then(success);
      },
      edit: function (id, success) {
        hfbHttpService.get('manage/label/' + id).then(success);
      },
      'delete': function (data, success) {
        hfbHttpService.delete('manage/label', data).then(success);
      }
    };
  }]);

