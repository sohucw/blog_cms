$(function () {
  'use strict';

  $(document).click('a[href=""]', function (e) {
    e.preventDefault();
  });

  //生成目录html代码
  $('#createCode').click(function () {
    var nodes = [];
    //找文章对应目录，支持h1到h6
    var content = $('.article-content');
    var hEl, i = 1, filter;
    while (i <= 6) {
      filter = '';
      for (var j = i + 1; j <= 6; j++) {
        if (j === 6) {
          filter += 'h' + j;
        } else {
          filter += 'h' + j + ',';
        }
      }
      //content.find('h' + i + ':not([data-traverse="true"])')
      hEl = content.find('h' + i + '[data-traverse!="true"]');
      var innerNodes = [];
      if (hEl.length > 0) {
        for (var k = 0; k < hEl.length; k++) {
          var elements = $(hEl[k]).nextUntil('h' + i, filter).andSelf();
          //标记已经遍历过
          elements.attr('data-traverse', 'true');
          innerNodes = innerNodes.concat(generateTree(elements));
        }
      }
      nodes = innerNodes.concat(nodes);
      i++;
    }
    var menus = generateMenu(nodes);
    var cataloguesHtml = generateHtml(menus, '');
    $('#cataloguesHtml').val(cataloguesHtml);
    $('.article-catalogue').html(cataloguesHtml);

    //删除属性data-traverse
    content.find('[data-traverse]').removeAttr('data-traverse');
  });

  var generateIndex = 0;

  /**
   * 遍历子结点，生成一颗树，各结点之间存在父子关系
   * @param elements
   * @returns {Array}
   */
  function generateTree(elements) {
    var nodes = [];
    nodes.push({
      id: elements[0].tagName + '-' + generateIndex++,
      tagName: elements[0].tagName,
      text: $(elements[0]).html(),
      parent: null,
      el: elements[0]
    });

    for (var i = 1; i < elements.length; i++) {
      var parent = null;
      if (elements[i].tagName > elements[i - 1].tagName) {// 比如：h4 > h3
        parent = nodes[i - 1].id;
      } else if (elements[i].tagName === elements[i - 1].tagName) {
        parent = nodes[i - 1].parent;
      } else {
        var tagName = elements[i].tagName;
        var j = i - 1;
        /*jshint -W035*/
        while (tagName <= nodes[--j].tagName) {
        }
        parent = nodes[j].id;
      }
      nodes.push({
        id: elements[i].tagName + '-' + generateIndex++,
        tagName: elements[i].tagName,
        text: $(elements[i]).html(),
        parent: parent,
        el: elements[i]
      });
    }
    return nodes;
  }

  /**
   * 把 nodes {Array} 数据（存在父子节点关系）转换为菜单数据
   * @param nodes 要转换的数组
   * @returns {Array}
   */
  function generateMenu(nodes) {
    var array = [];

    var i, len = nodes.length, map = {};
    //数组转换为键值对，并且设置属性children
    for (i = 0; i < len; i++) {
      nodes[i].children = [];
      map[nodes[i].id] = nodes[i];
    }

    var hashMap = {};
    nodes.forEach(function (item) {
      if (!hashMap[item.id]) {//如果没有处理该item
        hashMap[item.id] = item;//标记为处理

        var parentId = item.parent;
        if (parentId) {//有父节点
          if (hashMap[parentId]) {//父节点是否被处理过（即放入到array中）
            hashMap[parentId].children.push(item);
          } else {
            var parentNode = map[parentId];
            if (parentNode) {
              //设置子节点
              parentNode.children.push(item);
              array.push(parentNode);//放置父节点
              hashMap[parentId] = parentNode;//标记为处理过
            } else {//虽然parentId 存在，但父节点已被删除，则被归类到没有父节点
              array.push(item);
            }
          }
        } else {//没有父节点，直接放入array中
          array.push(item);
        }
      }
    });
    return array;
  }

  /**
   * 根据 nodes 生成目录html
   **/
  function generateHtml(nodes, parentTarget) {
    var prefix = 'catalog-';
    var html = '<ul class="nav">';
    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      var target = parentTarget + i;
      $(node.el).attr('data-target', prefix + target);
      html += '<li>';
      html += '<a href="" data-target="' + prefix + target + '">' + node.text + '</a>';
      if (node.children && node.children.length > 0) {
        html += generateHtml(node.children, target + '-');
      }
      html += '</li>';
    }
    html += '</ul>';
    return html;
  }

  //以上为生成目录html以及目录和内容相关的实现

  /**
   * 鼠标滚动监听目录实现
   * 参考 Bootstrap ScrollSpy 实现
   * @param element
   * @param options
   * @constructor
   */
  function ScrollSpy(element, options) {
    //jQuery代理，这样上下文this会指向 ScrollSpy
    var process = $.proxy(this.process, this);

    this.$body = $('body');
    this.$scrollElement = $(element).is('body') ? $(window) : $(element);
    this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
    this.selector = (this.options.target || '') + ' .nav li > a';
    this.offsets = [];
    this.targets = [];
    this.activeTarget = null;
    this.scrollHeight = 0;

    this.$scrollElement.on('scroll.hf.scrollspy', process);

    var self = this;
    $(this.options.target).on('click', '.nav li > a', function (e) {
      var $el = $(e.currentTarget);
      var target = $el.data('target') || $el.attr('href');
      var $target = $('[data-target="' + target + '"]');

      var offsetMethod = 'offset';
      var offsetBase = 0;
      if (!$.isWindow(self.$scrollElement[0])) {
        offsetMethod = 'position';
        offsetBase = self.$scrollElement.scrollTop();
      }

      self.$scrollElement.scrollTop($target[offsetMethod]().top + offsetBase - (self.options.offset - 1));
      $el[0].blur();
      process();
    });

    this.refresh();
    this.process();
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  };

  /**
   * 计算被监听元素实际高度
   */
  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
  };

  /**
   * 滚动页面时，刷新相关数据
   */
  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset';
    var offsetBase = 0;

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position';
      offsetBase = this.$scrollElement.scrollTop();
    }

    this.offsets = [];
    this.targets = [];
    this.scrollHeight = this.getScrollHeight();

    var self = this;

    //把滚动监听的元素和坐标保存到offsets和targets中
    this.$body.find(this.selector).map(function () {
      var $el = $(this);
      var target = $el.data('target') || $el.attr('href');
      var $target = $('[data-target="' + target + '"]');

      return ($target.length && $target.is(':visible') && [
        [$target[offsetMethod]().top + offsetBase, target]
      ]) || null;
    }).sort(function (a, b) {
      return a[0] - b[0];
    }).each(function () {
      self.offsets.push(this[0]);
      self.targets.push(this[1]);
    });
  };

  /**
   * 滚动时触发该方法
   * @returns {boolean|*}
   */
  ScrollSpy.prototype.process = function () {
    var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
    var scrollHeight = this.getScrollHeight();
    var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
    var offsets = this.offsets;
    var targets = this.targets;
    var activeTarget = this.activeTarget;
    var i;

    //不相等的话，重新刷新，比如改变页面窗口后
    if (this.scrollHeight !== scrollHeight) {
      this.refresh();
    }

    if (scrollTop >= maxScroll) {
      return activeTarget !== (i = targets[targets.length - 1]) && this.activate(i);
    }

    if (activeTarget && scrollTop <= offsets[0]) {
      return activeTarget !== (i = targets[0]) && this.activate(i);
    }

    for (i = offsets.length; i--;) {
      if (activeTarget !== targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1])) {
        this.activate(targets[i]);
      }
    }
  };

  /**
   * 设置当前活动的目录
   * @param target
   */
  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target;

    $(this.selector).parentsUntil(this.options.target, '.active').removeClass('active');

    var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';

    var active = $(selector).parents('li').addClass('active');

    active.trigger('activate.hf.scrollspy');
  };

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('hf.scrollspy');
      var options = typeof option === 'object' && option;

      if (!data) {
        $this.data('hf.scrollspy', (data = new ScrollSpy(this, options)));
      }
      if (typeof option === 'string') {
        data[option]();
      }
    });
  }

  var old = $.fn.hfscrollspy;

  $.fn.hfscrollspy = Plugin;
  $.fn.hfscrollspy.Constructor = ScrollSpy;


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.hfscrollspy.noConflict = function () {
    $.fn.hfscrollspy = old;
    return this;
  };


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.hf.scrollspy.data-api', function () {
    $('[data-hf-spy="scroll"]').each(function () {
      var $spy = $(this);
      Plugin.call($spy, $spy.data());
    });
  });

  $('body').hfscrollspy({ target: '.article-catalogue' });

});