'use strict';

angular.module('hopefutureBlogApp')
  .factory('auditService', ['hfbHttpService', function (hfbHttpService) {
    return {
      paging: function (data, success) {
        hfbHttpService.get('manage/auditarticle', data).then(success);
      },
      'delete': function (data, success) {
        hfbHttpService.delete('manage/auditarticle', data).then(success);
      },
      changeBoutique: function (data, success) {
        hfbHttpService.post('manage/auditarticle/boutique', data).then(success);
      },
      changeHomeTop: function (data, success) {
        hfbHttpService.post('manage/auditarticle/homeTop', data).then(success);
      }
    };
  }]);
