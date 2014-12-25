'use strict';

angular.module('hopefutureBlogApp')
  .factory('demoPaginationService', ['hfbHttpService', function (hfbHttpService) {
    return {
      paging: function (data, success) {
        hfbHttpService.get('pagination/paging', data).then(success);
      },
      save: function (data, success) {
        hfbHttpService.post('pagination', data).then(success);
      },
      edit: function (id, success) {
        hfbHttpService.get('pagination/' + id).then(success);
      },

      'delete': function (data, success) {
        hfbHttpService.delete('pagination', data).then(success);
      }
    };
  }]);

