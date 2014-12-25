/**
 * Created by linder on 2014/7/24.
 */
'use strict';

/**
 * 通用方法
 */
var commonMethod = {

  /**
   * 对 items {Array} 数据（存在父子节点关系）动态设置其 level
   * @param items 要设置的数组
   * @param parentField 父节点字段名称
   * @returns {Array}
   */
  setItemLevel: function (items, parentField) {
    parentField = parentField || 'parent';

    /**
     * 递归设置节点 level
     * @param item
     * @param map
     * @returns {*}
     */
    var setLevel = function (item, map) {
      if (!item[parentField]) {
        return 0;
      }
      var level = item.level;
      if (level !== undefined) {
        return level;
      } else {
        level = setLevel(map[item[parentField]], map);
        item.level = level + 1;
        return level + 1;
      }
    };

    // 给数据加上level
    var i, len = items.length, item, map = {};
    //数组转换为键值对
    for (i = 0; i < len; i++) {
      map[items[i]._id] = items[i];
    }
    //设置 level 值
    for (i = 0; i < len; i++) {
      item = items[i];
      if (item.level === undefined) {
        item.level = setLevel(item, map);
      }
    }
    return items;
  },

  /**
   * 把 items {Array} 数据（存在父子节点关系）转换为树形数据
   * @param items 要转换的数组
   * @param parentField 父节点字段名称
   * @returns {Array}
   */
  convertTreeNode: function (items, parentField) {
    parentField = parentField || 'parent';
    var array = [];

    var i, len = items.length, map = {};
    //数组转换为键值对
    for (i = 0; i < len; i++) {
      items[i].children = [];
      map[items[i]._id] = items[i];
    }

    var hashMap = {};
    items.forEach(function (item) {
      if (!hashMap[item._id]) {//如果没有处理该item
        hashMap[item._id] = item;//标记为处理

        var parentId = item[parentField];
        if (parentId) {//有父节点
          if (hashMap[parentId]) {//父节点是否被处理过（即放入到array中）
            hashMap[parentId].children.push(item);
          } else {
            var parentNode = map[parentId];
            if(parentNode){
              //设置子节点
              parentNode.children.push(item);
              array.push(parentNode);//放置父节点
              hashMap[parentId] = parentNode;//标记为处理过
            }else{//虽然parentId 存在，但父节点已被删除，则被归类到没有父节点
              array.push(item);
            }
          }
        } else {//没有父节点，直接放入array中
          array.push(item);
        }
      }
    });
    return array;
  },

  /**
   * 把html转换为text，去掉所有html标签
   * [\w\W] 匹配所有字符，包括换行，类似写法还有：[\s\S] [\d\D]
   * 实际上会把形如<sdfsdfs>的内容也会去掉
   * FIXME 该正则表达式待完善
   * @param html
   * @returns {string}
   */
  htmlToText: function (html) {
    var re = /<[^>]+>/g;
    return html.replace(re, '');
  },

  /**
   * 截取字符串长度
   * @param str 要计算的字符串
   * @param length 要截取的长度
   * @param bytes 是否是字节长度
   * @param ellipsis 超长时显示省略内容，默认为空字符串
   * @returns {*}
   */
  truncate: function (str, length, bytes, ellipsis) {
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
  }
};

module.exports = commonMethod;