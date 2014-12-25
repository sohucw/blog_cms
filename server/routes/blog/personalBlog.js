'use strict';

var articleDao = require('./../../dao/blog/ArticleDao');
var DataPage = require('../../utils/DataPage');
var accountDao = require('./../../dao/account/AccountDao');
var sessionManage = require('./../../utils/sessionManage');
var commentDao = require('./../../dao/blog/CommentDao');
var resourceDao = require('./../../dao/blog/ResourceDao');

/**
 * 校验用户是否存在
 */
function validate(conditions, callback) {
  accountDao.find(conditions, function (err, docs) {
    callback(!(err || docs == null || docs.length === 0));
  });
}
/**
 * 个人博客相关route
 *
 */
var personalBlog = {
  index: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    validate({loginName: loginName}, function (valid) {
      if (valid) {
        res.locals.personalBlogPage = true;
        res.render('blog/blog', {
          title: '我的博客首页'
        });
      } else {
        res.render('errors/invalid');
      }
    });
  },

  manage: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    validate({loginName: loginName, activated: true}, function (valid) {
      if (valid) {
        res.render('blog/blog-manage', {
          title: '管理我的博客'
        });
      } else {
        res.render('errors/invalid');
      }
    });
  },

  blog: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    //以下会设置其他条件，比如栏目，标签等，待实现
    articleDao.findBlogData(loginName, function (err, data) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        res.send({
          success: true,
          blogData: data
        });
      }
    });
  },

  articles: function (req, res) {
    var options = {
      itemsPerPage: req.query.itemsPerPage,
      currentPage: req.query.currentPage
    };
    var loginName = req.baseUrl.split('/')[1];
    var dataPage = new DataPage(options);
    articleDao.list(loginName, dataPage, function (err, data) {
      if (err) {
        res.send({success: false});
      } else {
        res.send({
          success: true,
          dataPage: data
        });
      }
    });
  },

  article: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    var articleId = req.params.articleId;
    var ip = req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
    var browserAgent = req.headers['user-agent'];
    var password = req.query.password;
    articleDao.articleInfo(loginName, articleId, password, function (err, data) {
      if (err) {
        res.send({
          success: false,
          errorMessage: err.message
        });
      } else {

        //记录浏览次数
        articleDao.readCount(articleId, ip, browserAgent, data.article.status, function (err) {
          if (err) {
            res.send({
              success: false,
              errorMessage: err.message
            });
          } else {
            // 如果登陆，设置用户信息
            var account = sessionManage.getAccountSession(req);
            if (account) {
              data.account = {
                accountID: account._id,
                commentator: account.loginName,
                email: account.email,
                site: account.site,
                headPortrait: account.headPortrait
              };
            }
            res.send({
              success: true,
              articleInfo: data
            });
          }
        });
      }
    });
  },

  /**
   * 校验受保护的文章输入的密码是否正确
   * @param req
   * @param res
   */
  validatePassword: function (req, res) {
    var articleId = req.params.articleId,
      protectedPassword = req.query.protectedPassword;
    articleDao.findArticlePassword(articleId, function (err, model) {
      if (err) {
        res.send(false);
      } else {
        res.send(model.protectedPassword === protectedPassword);
      }
    });
  },

  comment: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    var comment = req.body;
    comment.account = loginName;
    comment.browserAgent = req.headers['user-agent'];
    comment.ip = req._remoteAddress;

    commentDao.comment(comment, function (err, data) {
      if (err) {
        res.send({
          success: false,
          errMessage: err.message
        });
      } else {
        res.send({
          success: true,
          comment: data
        });
      }
    });
  },

  archive: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    var month = req.params.month;
    articleDao.archive(loginName, month, function (err, articles) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        res.send({
          success: true,
          articles: articles
        });
      }
    });
  },

  category: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    var id = req.params.id;
    articleDao.category(loginName, id, function (err, articles, category) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        res.send({
          success: true,
          articles: articles,
          category: category
        });
      }
    });
  },

  label: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    var id = req.params.id;
    articleDao.label(loginName, id, function (err, articles, label) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        res.send({
          success: true,
          articles: articles,
          label: label
        });
      }
    });
  },

  resource: function (req, res) {
    var loginName = req.baseUrl.split('/')[1];
    resourceDao.resourceList(loginName, function (err, resources) {
      if (err) {
        res.send({
          success: false
        });
      } else {
        var _resources = [];
        if (resources.length > 0) {
          var categoryId = resources[0].categoryId;
          var category = {
            categoryName: resources[0].categoryName,
            categoryResources: []
          };
          _resources.push(category);
          resources.forEach(function (item) {
            if (item.categoryId !== categoryId) {
              category = {
                categoryName: item.categoryName,
                categoryResources: []
              };
              category.categoryResources.push(item);
              _resources.push(category);
              categoryId = item.categoryId;
            } else {
              category.categoryResources.push(item);
            }
          });
        }
        res.send({
          success: true,
          resources: _resources
        });
      }
    });
  }
};

var express = require('express');
var router = express.Router();

router.get('/', personalBlog.index);//我的博客首页
router.get('/manage', personalBlog.manage);//管理我的博客，需要登录
router.get('/blog', personalBlog.blog);//获取博客相关数据
router.get('/articles', personalBlog.articles);//文章列表
router.get('/article/:articleId', personalBlog.article);//文章相关信息
router.get('/article/:articleId/password', personalBlog.validatePassword);//校验文章密码是否正确
router.post('/comment', personalBlog.comment);//发表评论
router.get('/archive/:month', personalBlog.archive);//文章归档
router.get('/category/:id', personalBlog.category);//分类目录文章列表
router.get('/label/:id', personalBlog.label);//标签文章列表
router.get('/resource', personalBlog.resource);//标签文章列表

module.exports = router;
