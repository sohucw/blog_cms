'use strict';

angular.module('hopefutureBlogApp')
  .factory('blogMethod', function () {

    var re = /\{\{:([\w-]+)\}\}/g;
    var ifRe = /\{\{if\s*([\w-]+)\}\}(.*?)\{\{\/if\}\}/g;//*? 表示懒惰匹配

    //渲染评论模板
    var tmpl =
      '   <div class="clearfix">' +
      '     <span class="pull-left {{:headPortrait}}" title="头像"></span>' +
      '     <div class="pull-left comment-meta">' +
      '       <p class="link"><span class="glyphicon glyphicon-calendar"></span> {{:createdDate}}</p>' +
      '       <p>{{:commentator}}</p>' +
      '     </div>' +
      '   </div>' +
      '   <div class="comment-content">{{:content}}</div>' +
      '   {{if showReply}}' +
      '      <div class="comment-reply">' +
      '        <span class="fa fa-mail-reply"></span> ' +
      '         <a href="" data-reply-comment="{{:_id}}">回复</a>' +
      '     </div>' +
      '   {{/if}}';

    // Public API here
    return {
      /**
       * 处理模板数据
       * 该方法支持键值即json格式的数据
       * @param template
       * @param values
       * @returns {*}
       */
      applyTemplate: function (template, values) {
        template = template.replace(ifRe, function (match, group1, group2) {
          return values[group1] === true ? group2 : '';
        });
        return template.replace(re, function (m, name) {
          return values[name] !== undefined ? values[name] : '';
        });
      },

      /**
       * 根据文章所引用标签的数量显示标签样式
       * @param labels
       * @returns {*}
       */
      parseArticleLabel: function (labels) {
        if (!labels) {
          return null;
        }
        var items = angular.copy(labels);
        labels.sort(function (item, next) {
          return item.count > next.count;
        });
        if (labels.length > 0) {
          var minCount = labels[0].count, maxCount = labels[labels.length - 1].count;
          if (minCount < 0) {
            minCount = 0;
          }
          if (maxCount < 0) {
            maxCount = 0;
          }
          var sub = maxCount - minCount;
          /**
           * 根据 count 大小设置字体大小，最大的为 30px，最小为14px,
           * 最大和最小差值为16
           * 如果 sub 为 0，则取最小字体14px
           */
          angular.forEach(items, function (item, index) {
            if (sub === 0) {
              item.style = {fontSize: '14px'};
            } else {
              var count = item.count || 0;
              if (count < 0) {
                count = 0;
              }
              item.style = {fontSize: (14 + 16 / sub * (count - 1)) + 'px'};
            }
          });
        }
        return items;
      },

      /**
       * 渲染所有的评论
       * @param comments
       * @returns {*}
       */
      renderComments: function (comments) {
        var self = this;

        function render(items, level) {
          if (!items) {
            return;
          }
          var html = '<ul class="list-unstyled comment-list">';
          var item;
          for (var i = 0, len = items.length; i < len; i++) {
            item = items[i];
            html += '<li data-comment-id="' + item._id + '" comment-level="' + level + '">';
            item.showReply = level < 5;
            html += self.applyTemplate(tmpl, item);
            if (item.children && item.children.length > 0) {
              html += render(item.children, level + 1);
            }
            html += '</li>';
          }
          html += '</ul>';

          return html;
        }

        var html = render(comments, 1);
        return html;
      },

      /**
       * 渲染新添加的评论
       * @param comments
       * @param level
       * @returns {*}
       */
      renderComment: function (comment, level) {
        var html = '<li data-comment-id="' + comment._id + '" comment-level="' + level + '">';
        comment.showReply = level < 5;
        html += this.applyTemplate(tmpl, comment);
        html += '</li>';
        return html;
      },

      /**
       * 让页面回到顶端
       */
      scrollTop: function(){
        //jQuery平滑回到顶端效果
        $('html, body').animate({
          scrollTop: 0
        }, {
          duration: 200,
          easing: 'swing'
        });
      }
    };
  });
