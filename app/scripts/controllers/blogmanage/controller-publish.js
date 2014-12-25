'use strict';

/**
 * 发表文章 Controller
 * @class PublishCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-13
 * */

angular.module('hopefutureBlogApp').controller('PublishCtrl', function ($scope, $filter, $location, publishService, publishMethod, publicityStatus, publishTypeStatus) {
  //先销毁tinyMCE实例
  if(tinymce && tinymce.get('content')){
    tinymce.get('content').destroy();
  }

  $scope.header = '撰写新文章';
  $scope.editStatus = false;

  $scope.article = {
    _id: undefined,
    title: '',
    content: '',
    account: '',
    status: '',
    publicityStatus: 'public',//公开度，默认公开
    publicityStatusName: publicityStatus.public,//默认取 public
    protectedPassword: '',//密码保护，需输入密码才能查看
    top: false,//文章置顶
    publishType: 'immediate',
    publishTypeName: publishTypeStatus.immediate,
    publishDate: '',
    articleLink: '',//文章永久链接，取相对地址
    type: 'richText',//文章类型
    categories: [],//文章所属分类
    labels: []//文章标签
  };

  /**
   * jshint global
   -HopeFuture
   * 用来处理显示 label（集合）
   */
  $scope.labelCollection = new HopeFuture.Collection(function (o) {
    return o.name;
  });

  //jshint -W106
  $scope.tinymceOptions = {
    height: 400,
    menubar: false, //Disable all menu
    content_css: '/styles/tinymce.css',
    plugins: [
      'autolink link image preview hr code fullscreen table textcolor charmap syntaxhighlighter'
    ],
    toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | styleselect | fontselect fontsizeselect formatselect ' +
      '| forecolor backcolor removeformat | bullist numlist outdent indent blockquote | alignleft aligncenter alignright alignjustify | ' +
      'hr image link unlink | charmap table syntaxhighlighter code | preview fullscreen'
  };

  var reg = /article\/\w+/;
  var path = $location.path();
  if (reg.test(path) === true) {
    $scope.header = '编辑文章';
    $scope.editStatus = true;
    var id = path.substring(path.lastIndexOf('/') + 1);

    publishService.edit(id, function (data) {
      if (data.success === true) {
        var item = data.item;
        //$scope.tinymceContent.setContent(item.content);
        item.articleLink = '/' + item.account + '#/article/' + item._id;
        item.catalogue = !!item.catalogue;
        angular.extend($scope.article, item);
        $scope.article.publicityStatusName = publicityStatus[item.publicityStatus];
        $scope.article.publishTypeName = publishTypeStatus[item.publishType];
        $scope.article.publishDate = $filter('date')($scope.article.publishDate, 'yyyy-MM-dd  HH:mm');
        var labels = $scope.article.labels;
        for (var i = 0, len = labels.length; i < len; i++) {
          $scope.labelCollection.add({name: labels[i]});
        }
      }
    });
  }else{
    $scope.article.status = 'draft';
  }

  /**
   * 保存草稿或更新
   */
  $scope.update = function (status) {
    if ($scope.validator.valid()) {
      $scope.publish(status);
    }
  };

  /**
   * 发布
   * @param status
   */
  $scope.publish = function (status) {
    status = status || 'publish';
    $scope.article.status = status;
    //$scope.article.content = $scope.tinymceContent.getContent();
    $scope.article.publishDate = $('#publishDate').val();
    var article = angular.copy($scope.article);
    delete article.account;
    delete article.articleLink;
    delete article.createdMonth;
    delete article.createdDate;
    delete article.readCounts;
    delete article.publicityStatusName;
    delete article.publishTypeName;
    //生成文章栏目
    if(article.catalogue){
      var html = publishMethod.generateHtml(article.content);
      article.catalogueHtml = html.catalogue;
      article.catalogueContent = html.content;
    }else{
      article.catalogueHtml = undefined;
      article.catalogueContent = undefined;
    }
    publishService.save(article, function (data) {
      if (data.success === true) {
        $scope.$parent.showPublishInfo = true;
        switch (status) {
          case 'draft':
            $scope.$parent.publishInfo = '文章草稿已更新';
            break;
          case 'publish':
            $scope.$parent.publishInfo = '文章已发布';
            break;
          case 'modified':
            $scope.$parent.publishInfo = '文章已更新';
            break;
        }
        if ($scope.editStatus === false) {
          tinymce.get('content').destroy();
          $location.path('/article/' + data._id);
        }
      }
    });
  };
})
  //公开度
  .controller('PublicityCtrl', function ($scope, publicityStatus) {

    $scope.publicityPanel = false;

    $scope.show = {
      top: true,
      protectedPassword: false
    };

    $scope.$watch('$parent.article.publicityStatus', function (newValue, oldValue) {
      switch (newValue) {
        case 'public':
          $scope.show.top = true;
          $scope.show.protectedPassword = false;
          $('#protectedPassword').rules('remove', 'required');
          $('#protectedPassword').valid();
          break;
        case 'protected':
          $scope.show.top = false;
          $scope.show.protectedPassword = true;
          $('#protectedPassword').rules('add', 'required');
          break;
        case 'private':
          $scope.show.top = false;
          $scope.show.protectedPassword = false;
          $('#protectedPassword').rules('remove', 'required');
          $('#protectedPassword').valid();
          break;
      }
    });

    /**
     * 设置文章公开度
     */
    $scope.setPublicityStatus = function () {
      var status = $scope.$parent.article.publicityStatus;
      if(status === 'protected' && !$('#protectedPassword').valid()){
        return;
      }
      switch (status) {
        case 'public':
          $scope.$parent.article.protectedPassword = '';
          break;
        case 'protected':
          $scope.$parent.article.top = false;
          break;
        case 'private':
          $scope.$parent.article.top = false;
          $scope.$parent.article.protectedPassword = '';
          break;
      }
      $scope.$parent.article.publicityStatusName = publicityStatus[status];
      $scope.publicityPanel = false;
    };

  })
  .controller('PublishTypeCtrl', function ($scope, publishTypeStatus) {//发布方式
    $scope.publishTypePanel = false;

    $scope.setPublishTypeStatus = function () {
      var status = $scope.$parent.article.publishType;
      if (status === 'immediate') {
        //$scope.$parent.article.publishDate = '';
        $('#publishDate').val('');
      }
      $scope.$parent.article.publishTypeName = publishTypeStatus[status];
      $scope.publishTypePanel = false;
    };

    $scope.$watch('$parent.article.publishType', function (newValue, oldValue) {
      if (newValue === 'delay') {
        $('#publishDate').rules('add', 'required');
      } else {
        $('#publishDate').rules('remove', 'required');
        $('#publishDate').valid();
      }
      $scope.showPublishDate = newValue === 'delay';
    });

    $('#dateTimePicker').datetimepicker({
      minDate: new Date()
    });
  })
  .controller('ArticleLabelCtrl', function ($scope, publishService,blogMethod) {// 标签
    var labelCollection = $scope.$parent.labelCollection;
    $scope.addLabel = function () {
      if (!$scope.label) {
        return;
      }
      var labels = $scope.label.split(',');
      angular.forEach(labels, function (item, index) {
        var _item = labelCollection.key(item);
        if (!_item) {//创建新的
          _item = {
            name: item
          };
          labelCollection.add(_item);
          $scope.$parent.article.labels.push(item);
        }
      });
      $scope.label = '';
    };

    $scope.addLabelFromC = function (item) {
      var _item = labelCollection.key(item);
      if (!_item) {//创建新的
        _item = {
          name: item.name
        };
        labelCollection.add(_item);
        $scope.$parent.article.labels.push(item.name);
      }
    };

    $scope.removeLabel = function (item) {
      labelCollection.removeByKey(item);
      var labels = $scope.$parent.article.labels;
      var index = labels.indexOf(item);
      labels.splice(index, 1);
    };

    $scope.openLabelPanel = function () {
      if (!$scope.showLabelPanel) {
        publishService.getLabel(function (data) {
          if (data.success === true) {
            var items = blogMethod.parseArticleLabel(data.items);
            $scope.labels = items;
          }
        });
      }
      $scope.showLabelPanel = !$scope.showLabelPanel;
    };
  })
  .controller('ArticleCategoryCtrl', function ($scope, $timeout, publishService, categoryMethod, publishMethod) {// 文章分类

    var selectedCategories = [];
    /**
     * 返回文章分类列表和常用的分类列表
     * 延迟加载，编辑的时候，等待$scope.$parent.article.categories先加载完
     * 这样其实不能完全保证$scope.$parent.article.categories已加载完
     * 正确的做法是监听注册事件，待实现
     */
    $timeout(function () {
      publishService.getCategoryAndFrequentCategory(function (data) {
        var categories = $scope.$parent.article.categories;
        if (data[0].success === true) {
          var collection = categoryMethod.sortItems(data[0].items);
          var items = collection.getItems();
          angular.forEach(items, function (item, index) {
            item.style = {marginLeft: item.level * 20 + 'px'};
            if (categories.indexOf(item._id) !== -1) {
              item.checked = true;
              selectedCategories.push(item._id);
            }
          });

          $scope.categories = items;
        }

        if (data[1].success === true) {
          $scope.frequentCategories = data[1].items;
          angular.forEach($scope.frequentCategories, function (item, index) {
            if (categories.indexOf(item._id) !== -1) {
              item.checked = true;
            }
          });
        }
      });
    }, 200);

    $scope.changeCategory = function (category, from) {
      if (category.checked === true) {
        if (selectedCategories.indexOf(category._id) === -1) {
          selectedCategories.push(category._id);
        }
      } else {
        var index = selectedCategories.indexOf(category._id);
        selectedCategories.splice(index, 1);
      }

      var _categories;
      if (from === 'frequent') {
        _categories = $scope.categories;
      } else {
        _categories = $scope.frequentCategories;
      }
      if (_categories) {
        for (var i = 0, len = _categories.length; i < len; i++) {
          if (_categories[i]._id === category._id) {
            _categories[i].checked = category.checked;
            break;
          }
        }
      }
      $scope.$parent.article.categories = selectedCategories;
    };

    //添加新的分类目录
    $scope.category = {
      name: '',
      parentCategory: ''
    };

    $scope.addCategory = function () {
      if ($('#category').val() === '') {
        $scope.$parent.alerts = [
          {type: 'danger', message: '分类名称不能为空！'}
        ];
        return;
      } else {
        publishMethod.validCategory($scope, function(valid){
          if (valid) {
            var parentCategory = $scope.category.parentCategory;
            var category = angular.copy($scope.category);
            delete category.parentCategory;
            if (parentCategory) {
              category.parent = parentCategory._id;
            }
            publishService.addCategory(category, function (data) {
              if (data.success === true) {
                var categories = $scope.$parent.article.categories;
                var collection = categoryMethod.sortItems(data.items);
                var items = collection.getItems();
                angular.forEach(items, function (item, index) {
                  item.style = {marginLeft: item.level * 20 + 'px'};
                  if (categories.indexOf(item._id) !== -1) {
                    item.checked = true;
                  }
                });
                $scope.categories = items;

                $scope.category.name = '';
                $scope.category.parentCategory = '';
              }
            });
          }
        });
      }
    };
    $scope.$watch('category.name', function (newValue, oldValue) {
      if (newValue !== '') {
        $scope.$parent.alerts = [];
        publishMethod.validCategory($scope);
      }
    });
    $scope.$watch('category.parentCategory', function (newValue, oldValue) {
      if ($scope.category.name !== '') {
        publishMethod.validCategory($scope);
      }
    });
  });
