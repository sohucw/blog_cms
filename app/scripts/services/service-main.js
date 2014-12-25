'use strict';

angular.module('hopefutureBlogApp')
  .factory('mainService', ['hfbHttpService', function (hfbHttpService) {
    return {
      boutiqueArticle: function (data, success) {
        hfbHttpService.get('/blog', data).then(success);
      }
    };
  }]);

