'use strict';

/**
 * 计算截取字符串长度，可以以字节的长度截取
 * GB-2312和UTF-8编码中，中文字符占用2个字节，但是在iso-8859-1编码中，中文字符占用5个字节。
 * 匹配中文字符的正则表达式： [\u4e00-\u9fa5]
 * 匹配双字节字符(包括汉字在内)：[^\x00-\xff]
 */
angular.module('hopefutureBlogApp')
  .filter('truncate', function () {
    /**
     * @param str 要计算的字符串
     * @param length 要截取的长度
     * @param bytes 是否是字节长度
     * @param ellipsis 超长时显示省略内容，默认为空字符串
     */
    return function (str, length, bytes, ellipsis) {
      if (str == null || typeof length !== 'number' || length <= 0) {
        return '';
      }
      str = typeof str === 'string' ? str : str.toString();
      ellipsis = ellipsis || '';
      if (bytes) {
        var actualLen = 0,
          i = 0,
          len = str.length;
        for (; i < len; i++) {
          // str.charCodeAt(i) 大于 127 表示是双字节
          actualLen += str.charCodeAt(i) > 127 ? 2 : 1;
          /**
           * 也可以用正则表达式来判断
           var reg = /[^\x00-\xFF]/;
           actualLen += reg.test(str[i]) > 127 ? 2 : 1;
           */
          if (actualLen >= length) {
            break;
          }
        }
        return i === len ? str : str.substring(0, i) + ellipsis;
      } else {
        return str.length > length ? str.substring(0, length) + ellipsis : str;
      }
    };
  });
