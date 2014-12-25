'use strict';

angular.module('hopefutureBlogApp')
  .factory('demoGridService', ['hfbHttpService', function (hfbHttpService) {
    return {
      list: function (success) {
        hfbHttpService.get('grid/list').then(success);
      },
      save: function (data, success) {
        hfbHttpService.post('grid', data).then(success);
      },
      edit: function (id, success) {
        hfbHttpService.get('grid/' + id).then(success);
      },

      'delete': function (data, success) {
        hfbHttpService.delete('grid', data).then(success);
      }
    };
  }]);

