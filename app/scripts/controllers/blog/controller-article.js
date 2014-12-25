'use strict';

/**
 * 文章 Controller
 * @class ArticleCtrl
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-7-23
 * */

angular.module('hopefutureBlogApp')
  .controller('ArticleCtrl', function ($scope, $location, $modal, $timeout, $sce, blogService, errorCodes, blogMethod) {

    var pathname = window.location.pathname;
    var account = pathname.substring(1);
    var absUrl = $location.absUrl();
    var articleIdReg = /\/\w+$/;

    $scope.showArticleInfo = false;//是否显示文章信息

    $scope.articleLink = absUrl;
    //文章相关信息
    $scope.article = {};
    $scope.comments = [];
    $scope.prevArticle = undefined;
    $scope.nextArticle = undefined;
    $scope.relatedArticle = [];

    // 评论表单
    var comment = {
      articleID: undefined,
      commentator: '',
      accountID: '',
      headPortrait: 'head-portrait-default',
      content: '',
      email: '',
      site: '',
      commentParent: undefined
    };

    $scope.comment = angular.copy(comment);

    $scope.isReply = false;//是否为回复评论
    $scope.resetComment = function (isReply) {
      $scope.isReply = isReply;
      $scope.comment = angular.copy(comment);
      $scope.validator.resetForm();
    };

    /**
     * 取消回复
     */
    $scope.cancelReply = function () {
      $timeout(function () {
        var commentFormPanel = $('#commentFormPanel');
        $('#commentFormContainer').append(commentFormPanel);
        $scope.resetComment(false);
      }, 100);
    };

    /**
     * 获取文章信息
     * 对于密码保护的文章，如果密码输入正确，需要传递密码
     * @param passed
     */
    $scope.articleInfo = function (password, callback) {
      var path = $location.path();
      var id = path.substring(path.lastIndexOf('/') + 1);
      var params = password ? {params: {password: password}} : undefined;
      blogService.articleInfo(account, id, params, function (data) {
        if (data.success === true) {
          $scope.article = data.articleInfo.article;
          //可以解析style样式，但不能执行javascript代码
          $scope.article.content = $sce.trustAsHtml($scope.article.content);

          $scope.comments = data.articleInfo.comments;
          if (data.articleInfo.prevArticle) {
            $scope.prevArticle = data.articleInfo.prevArticle;
            $scope.prevArticle.articleLink = absUrl.replace(articleIdReg, '/' + $scope.prevArticle._id);
          }

          if (data.articleInfo.nextArticle) {
            $scope.nextArticle = data.articleInfo.nextArticle;
            $scope.nextArticle.articleLink = absUrl.replace(articleIdReg, '/' + $scope.nextArticle._id);
          }

          $scope.relatedArticle = data.articleInfo.relatedArticle;
          angular.forEach($scope.relatedArticle, function (item) {
            item.articleLink = item.articleLink || absUrl.replace(articleIdReg, '/' + item._id);
          });

          comment.articleID = data.articleInfo.article._id;
          $scope.comment.articleID = data.articleInfo.article._id;
          if (data.articleInfo.account) {
            angular.extend(comment, data.articleInfo.account);
            angular.extend($scope.comment, data.articleInfo.account);
          }

          //FIXME 这里递归渲染没有使用 angular 指令实现（以后有机会再研究），只是简单的通过模板来渲染html
          var html = blogMethod.renderComments($scope.comments);
          $('#commentList').html(html);

          //初始化事件
          $('#commentList').on('click', 'a[data-reply-comment]', function (e) {
            e.preventDefault();
            var el = $(e.target);
            var parentEl = el.parent();

            var commentId = el.attr('data-reply-comment');
            $scope.resetComment(true);
            $scope.comment.commentParent = commentId;

            var commentFormPanel = $('#commentFormPanel');
            parentEl.after(commentFormPanel);
            $scope.$apply();
          });
          if (callback) {
            callback(true);
          }
          $timeout(function(){
            //此处不再调用SyntaxHighlighter.autoloader来动态加载brush，因为SyntaxHighlighter.autoloader的实现是在页面加载完后处理自动加载
            SyntaxHighlighter.highlight();
            $scope.showArticleInfo = true;
          },100);
        } else {
          $scope.showArticleInfo = false;
          if (data.errorMessage === 'protected') {
            $modal.open({
              backdrop: 'static',// 设置为 static 表示当鼠标点击页面其他地方，modal不会关闭
              //keyboard: false,// 设为false，按 esc键不会关闭 modal
              templateUrl: 'protectedPasswordModal.html',
              controller: 'ProtectedModalCtrl',
              resolve: {// 传递数据
                formData: function () {
                  return  {
                    articleInfoFn: $scope.articleInfo,
                    articleId: id,
                    account: account
                  };
                }
              }
            });
          }else if(data.errorMessage === 'password error'){
            callback(false);
          }
        }
      });
    };

    $scope.articleInfo();

    //发表评论
    $scope.publishComment = function () {
      if ($('form[name="commentForm"]').valid()) {
        publishComment();
      }
    };

    //提交发表评论
    function publishComment() {
      blogService.comment(account, $scope.comment, function (data) {
        if (data.success) {
          if ($scope.isReply) {
            var commentFormPanel = $('#commentFormPanel');
            $('#commentFormContainer').append(commentFormPanel);

            var itmeEl = $('li[data-comment-id="' + $scope.comment.commentParent + '"]');
            var html = blogMethod.renderComment(data.comment, parseInt(itmeEl.attr('comment-level')) + 1);
            var childComment = itmeEl.children('ul.comment');
            if (childComment.length === 0) {
              childComment = $('<ul class="list-unstyled comment-list"/>').appendTo(itmeEl);
            }
            childComment.append(html);
          } else {
            $('#commentList > ul.comment-list').append(blogMethod.renderComment(data.comment, 1));
          }

          $scope.resetComment(false);
        } else {
          var errCode = data.errMessage;
          $modal.open({
            templateUrl: '../views/templates/alert-modal.html',
            controller: 'AlertModalCtrl',
            resolve: {
              config: function () {
                return {
                  modalContent: errorCodes[errCode]
                };
              }
            }
          });
        }
      });
    }
  })
  .controller('ProtectedModalCtrl', function ($scope, $modalInstance, blogService, formData) {
    $scope.articleId = formData.articleId;
    $scope.account = formData.account;
    $scope.protected = {
      password: ''
    };
    $scope.viewArticle = function () {
      formData.articleInfoFn($scope.protected.password, function (success) {
        if (success === true) {
          $modalInstance.close();
        }
      });
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });

