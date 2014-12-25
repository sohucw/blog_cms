'use strict';

/**
 * 通用过滤器
 */
angular.module('hopefutureBlogApp')
  .filter('arrayToStr', function () {
    /**
     * 把数组转换成字符串
     * @param array 要转换的数组
     * @param separater 分隔符，默认为空格
     * @param text 数组为空时返回的值，默认为空字符串
     */
    return function (array, separater, text) {
      text = text || '';
      if(array == null || (angular.isArray(array) && array.length === 0)){
        return text;
      }
      separater = separater || ' ';
      return array.join(separater);
    };
  });
