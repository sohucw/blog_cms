'use strict';

/**
 * 创建 Article Dao 用来操作 ArticleModel，实现数据的增删改查等功能
 * @module ArticleDao
 * @class
 * @since 0.2.0
 * @version @@currentVersion
 * @author Linder linder0209@126.com
 * @createdDate 2014-6-16
 * */
function ArticleDao(Model) {
  this.model = Model;
}

var ArticleModel = require('../../models/blog/ArticleModel');
var articleDao = new ArticleDao(ArticleModel);
module.exports = articleDao;

var labelDao = require('./LabelDao');
var categoryDao = require('./CategoryDao');

var LabelModel = require('../../models/blog/LabelModel');
var CategoryModel = require('../../models/blog/CategoryModel');
var AccountModel = require('../../models/account/AccountModel');
var CommentModel = require('../../models/blog/CommentModel');
var ArticleReadCountModel = require('../../models/blog/ArticleReadCountModel');
var ResourceModel = require('../../models/blog/ResourceModel');

var commonMethod = require('./../../utils/commonMethod');
var ObjectId = require('mongoose').Types.ObjectId;

var underscore = require('underscore');
var moment = require('moment');


/**
 * 保存数据，包括添加和修改
 * @method
 * @param data {ArticleModel} ArticleModel 实例
 * @param callback {function}回调函数
 */
ArticleDao.prototype.save = function (data, callback) {
  var model = this.model;
  if (data._id) {
    var article;
    var promise = model.findById(data._id).exec();
    promise.then(function (doc) {
      if (doc) {
        article = doc;
        var labelIds = doc.labels.map(function (item) {
          return item;
        });

        return LabelModel.find({ _id: { $in: labelIds }}, {name: 1}).exec();
      } else {
        throw new Error('operate error！');
      }

    }).then(function (labels) {

      //文章中原先的标签
      var existsLabels = [];
      labels.forEach(function (item) {
        existsLabels.push(item.name);
      });
      //新添加的标签
      var newLabels = underscore.clone(data.labels);
      var _labels = [];
      existsLabels.forEach(function(item){
        var index = newLabels.indexOf(item);
        //已存在的标签不在新添加中，则 标签count减一
        if (index === -1) {
          _labels.push({
            name: item,
            increase: false
          });
        } else {
          //存在的话从新标签中删除掉
          newLabels.splice(index, 1);
        }
      });
      newLabels.forEach(function(item){
        _labels.push({
          name: item,
          increase: true
        });
      });

      //分类
      var existsCategories = article.categories;
      var newCategories = underscore.clone(data.categories);
      var _categories = [];
      existsCategories.forEach(function(item){
        var index = newCategories.indexOf(item);
        //已存在的分类不在新添加中，则 分类count减一
        if (index === -1) {
          _categories.push({
            _id: item,
            increase: false
          });
        } else {
          //存在的话从新标签中删除掉
          newCategories.splice(index, 1);
        }
      });

      newCategories.forEach(function(item){
        _categories.push({
          _id: item,
          increase: true
        });
      });

      categoryDao.updateCount(_categories, function (err) {
        if (err) {
          return callback(err);
        }
        labelDao.update(data.account, _labels, function (err) {
          if (err) {
            return callback(err);
          }

          var conditions = {name: { $in: data.labels }, account: data.account};
          labelDao.find(conditions, function (err, docs) {
            if (err) {
              return callback(err);
            } else {
              data.labels = docs.map(function (item, index) {
                return item._id.toString();
              });

              data.updatedDate = new Date();
              var _id = data._id;
              // 删除多余的属性，防止前端非法操作
              delete data._id;
              delete data.account;
              delete data.articleLink;
              delete data.createdMonth;
              delete data.createdDate;
              delete data.readCounts;
              model.update({_id: _id}, data, function (err, numberAffected, rawResponse) {
                return callback(err);
              });

            }
          });
        });
      });
    }).then(null, function (err) {
      return callback(err);
    });
  } else {
    //FIXME: 这里应该用异步添加的方式实现
    //先保存添加的标签
    labelDao.update(data.account, data.labels, function (err) {
      if (err) {
        return callback(err);
      }
      //保存添加的分类
      categoryDao.updateCount(data.categories, function (err) {
        if (err) {
          return callback(err);
        }
        //查询标签列表
        var conditions = {name: { $in: data.labels }, account: data.account};
        labelDao.find(conditions, function (err, docs) {
          if (err) {
            return callback(err);
          } else {
            data.labels = docs.map(function (item, index) {
              return item._id.toString();
            });
            data.createdMonth = new moment().format('YYYY-MM');

            var entity = new model(data);
            entity.save(function (err, product, numberAffected) {
              if (err) {
                return callback(err);
              } else {
                return callback(err, product._doc._id);
              }
            });
          }
        });
      });
    });
  }
};

/**
 * 分页显示
 * 该查询比较复杂，由于mongodb不支持多表关联查询，所以需要自己写代码实现
 * 主要用到了异步 promise 来分别查询关联的字段，最后利用键值处理
 * @method
 * @param loginName {String} 账户登录名
 * @param searchContent {String} 搜索内容
 * @param dataPage {DataPage} 分页数据
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.pagination = function (loginName, searchContent, dataPage, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;

  var conditions = {};
  if (loginName) {
    conditions = {account: loginName};
  }
  if (searchContent) {
    var match = new RegExp(searchContent, 'ig');
    underscore.extend(conditions, { $or: [
      { title: match } ,
      { content: match }
    ] });
  }
  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      var categoryIds = [], labelIds = [], articlesData, categoryMap = {}, labelMap = {}, articleIds = [], readMap = {}, commentMap = {};

      var promise = model.find(conditions, {_id: 1, title: 1, account: 1, status: 1, articleLink: 1, categories: 1, labels: 1, top: 1, homeTop: 1, boutique: 1, createdDate: 1},
        {skip: skip, limit: limit, sort: {createdDate: -1}}).exec();

      promise.then(function (articles) {
        articlesData = articles.map(function (item) {
          return item._doc;
        });
        articles.forEach(function (item) {
          item.labels.forEach(function (it) {
            if (labelIds.indexOf(it) === -1) {
              labelIds.push(it);
            }
          });
          item.categories.forEach(function (it) {
            if (categoryIds.indexOf(it) === -1) {
              categoryIds.push(it);
            }
          });
          articleIds.push(item._id.toString());
        });

        //标签
        return LabelModel.find({ _id: { $in: labelIds }}).exec();
      }).then(function (labels) {
        labels.forEach(function (item, index) {
          labelMap[item._id] = item.name;
        });

        //分类
        return CategoryModel.find({ _id: { $in: categoryIds }}).exec();
      }).then(function (categories) {
        categories.forEach(function (item, index) {
          categoryMap[item._id] = item.name;
        });

        //浏览次数
        return ArticleReadCountModel.aggregate({$match: {articleID: {$in: articleIds}}}, { $group: { _id: '$articleID', readCounts: { $sum: 1 }}}).exec();
      }).then(function (readCounts) {
        readCounts.forEach(function (item) {
          readMap[item._id] = item.readCounts;
        });

        //查询评论个数
        return CommentModel.aggregate({$match: {articleID: { $in: articleIds }}}, { $group: { _id: '$articleID', commentCount: { $sum: 1 }}}).exec();
      }).then(function (commentCounts) {
        commentCounts.forEach(function (item) {
          commentMap[item._id] = item.commentCount;
        });

        articlesData.forEach(function (item, index) {
          item.labels = item.labels.map(function (item) {
            return labelMap[item];
          });
          item.labels =  item.labels.filter(function(item){
            return item != null;
          });
          item.categories = item.categories.map(function (item) {
            return categoryMap[item];
          });
          item.categories =  item.categories.filter(function(item){
            return item != null;
          });
          item.readCounts = readMap[item._id.toString()] || 0;
          item.commentCounts = commentMap[item._id.toString()] || 0;
        });

        dataPage.setItems(articlesData);
        return callback(err, dataPage);
      }).then(null, function (err) {
        return callback(err);
      });

    }
  });
};

/**
 * 根据id查询数据
 * @method
 * @param id {String} 主键
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.findById = function (id, callback) {
  this.model.findById(id, {_id: 1, title: 1, content: 1, account: 1, status: 1, publicityStatus: 1, protectedPassword: 1, top: 1,
    publishType: 1, publishDate: 1, type: 1, categories: 1, labels: 1, catalogue: 1}, function(err, model) {
    if (err) {
      return callback(err);
    }
    var conditions = {_id: { $in: model.labels }};
    /*jshint -W083 */
    labelDao.find(conditions, function (err, labels) {
      if (err) {
        return callback(err);
      }
      model.labels = labels.map(function (item, index) {
        return item.name;
      });
      return callback(err, model);
    }, {name: 1});
  });
};

/**
 * 删除记录
 * @method
 * @param loginName {String} 账户登录名
 * @param ids { Array } 文章id
 * 要删除数据的条件，例如：{ field: { $n: [<value1>, <value2>, ... <valueN> ] } }
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.delete = function (loginName, ids, callback) {
  var model = this.model;
  var conditions = { _id: { $in: ids } };

  model.find(conditions, {categories: 1, labels: 1}, function (err, docs) {
    var _categories = {}, _labels = {};
    docs.forEach(function (item) {
      item.labels.forEach(function (label) {
        if (_labels[label]) {
          _labels[label]++;
        } else {
          _labels[label] = 1;
        }
      });
      item.categories.forEach(function (category) {
        if (_categories[category]) {
          _categories[category]++;
        } else {
          _categories[category] = 1;
        }
      });
    });

    categoryDao.reduceCount(_categories, function (err) {
      if (err) {
        return callback(err);
      }
      labelDao.reduceCount( _labels, function (err) {
        if (err) {
          return callback(err);
        }
        CommentModel.remove({articleID: {$in: ids}}, function (err) {
          if (err) {
            return callback(err);
          }
          ArticleReadCountModel.remove({articleID: {$in: ids}}, function (err) {
            if (err) {
              return callback(err);
            }
            model.remove(conditions, function (err) {
              return callback(err);
            });
          });
        });
      });
    });
  });
};

/**
 * 根据二级域名（账户登录名）返回 相关博客数据
 * @param loginName {String} 账户登录名
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.findBlogData = function (loginName, callback) {
  //以下代码加载博客数据，包括个人信息，最热文章，近期文章，文章归档（近期五个月文章），分类目录，标签，近期评论，资源链接
  var data = {};
  var model = this.model;
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, publicityStatus: { $ne: 'private' }};
  var articlesId = [];

  var promise = AccountModel.findOne({loginName: loginName}, {_id: 1, name: 1, sex: 1, headPortrait: 1, englishName: 1, residence: 1, position: 1,
    email: 1, signature: 1}).exec();

  promise.then(function (account) {
    data.account = account;//用户信息

    return model.find(conditions, {_id: 1, title: 1, articleLink: 1, readCounts: 1}, {limit: 10}).sort({readCounts: -1}).exec();
  }).then(function (articles) {
    data.hotArticles = articles;//最热文章

    return model.find(conditions, {_id: 1, title: 1, articleLink: 1, createdDate: 1}, {limit: 10}).sort({createdDate: -1}).exec();
  }).then(function (articles) {
    var docs = articles.map(function (item) {
      var doc = item._doc;
      doc.createdDate = moment(doc.createdDate).format('YYYY年MM月DD');
      return doc;
    });
    data.recentArticles = docs;//近期文章

    /**
     * 分组查询
     * http://blog.csdn.net/xtqve/article/details/8983868
     * http://docs.mongodb.org/manual/reference/sql-aggregation-comparison/
     * 操作符介绍：
     $project：包含、排除、重命名和显示字段
     $match：查询，需要同find()一样的参数
     $limit：限制结果数量
     $skip：忽略结果的数量
     $sort：按照给定的字段排序结果
     $group：按照给定表达式组合结果
     $unwind：分割嵌入数组到自己顶层文件
     */
    return model.aggregate({$match: {account: loginName, status: {$in: ['publish', 'modified']}, publicityStatus: { $ne: 'private' }}},
      {$limit: 10}, { $group: { _id: '$createdMonth', articleCount: { $sum: 1 }}},
      { $sort: { createdDate: -1 } }).exec();
  }).then(function (articles) {
    data.articlesArchive = articles.map(function (item) {
      var month = item._id.split('-');
      item.month = month[0] + '年' + month[1] + '月';
      return item;
    });//文章归档

    return CategoryModel.find({account: loginName}, {_id: 1, name: 1, count: 1}).exec();
  }).then(function (categories) {
    data.categories = categories;//分类目录

    return LabelModel.find({account: loginName}, {_id: 1, name: 1, count: 1}).exec();
  }).then(function (labels) {
    data.labels = labels;// 标签

    return CommentModel.find({account: loginName}, {_id: 1, articleID: 1, commentator: 1}, {limit: 5, sort: {createdDate: -1}}).exec();
  }).then(function (comments) {
    data.comments = [];// 近期评论
    articlesId = comments.map(function (item) {
      data.comments.push(item._doc);
      return item.articleID;
    });

    return model.find({_id: {$in: articlesId}}, {_id: 1, title: 1}).exec();
  }).then(function (articles) {
    var articleMap = {};
    articles.forEach(function (item) {
      articleMap[item._id.toString()] = item.title;
    });
    //设置评论文章标题
    data.comments.forEach(function (item) {
      item.articleTitle = articleMap[item.articleID];
    });

    return ResourceModel.find({account: loginName}, {_id: 1, name: 1, link: 1}, {limit: 5, sort: {createdDate: -1}}).exec();
  }).then(function (resources) {
    data.resources = resources;//资源链接

    return callback(null, data);
  }).then(null, function (err) {
    return callback(err);
  });
};


/**
 * 分页显示文章 个人博客
 * @method
 * @param loginName {String} 登录用户名
 * @param dataPage {DataPage} 分页数据
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.list = function (loginName, dataPage, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, publicityStatus: { $ne: 'private' }};

  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      var sort = {sort: {top: -1, _id: -1}};
      getArticlePagination(model, conditions, skip, limit, sort, dataPage, callback);
    } else {
      return callback(err);
    }
  });
};

/**
 * 获取文章相关数据
 * @param loginName {String} 账户登录名
 * @param articleId {String} 文章id
 * @param password {String} 受保护的文章密码
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.articleInfo = function (loginName, articleId, password, callback) {
  //以下加载文章内容，相关文章，前后文章，评论列表
  var data = {};
  var model = this.model;
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, publicityStatus: { $ne: 'private' }};
  var articleLabels;
  var categories;

  var promise = model.findById(articleId, {_id: 1, title: 1, content: 1, status:1, publicityStatus: 1, protectedPassword: 1,
    categories: 1, labels: 1, catalogue: 1, catalogueHtml: 1, catalogueContent:1, readCounts: 1, articleLink: 1, createdDate: 1}).exec();

  promise.then(function (article) {
    if (password) {//如果传递密码，表示该文章是受保护的，判断输入的密码是否正确
      if (article.protectedPassword !== password) {
        throw new Error('password error');
      }
    } else {
      if (article.publicityStatus === 'protected') {
        throw new Error('protected');
      }
    }
    data.article = article._doc;//文章信息
    data.article.createdDate = moment(data.article.createdDate).format('YYYY年MM月DD HH:mm:ss');
    //处理文章是否已经生成目录
    if(data.article.catalogue && data.article.catalogueHtml){
      delete data.article.content;
    }else{
      data.article.catalogue = false;
    }
    articleLabels = article.labels.map(function (item) {
      return item;
    });
    categories = article.categories.map(function (item) {
      return item;
    });

    return CategoryModel.find({_id: { $in: categories }}, {_id: 1, name: 1}).exec();
  }).then(function (categories) {
    data.article.categories = categories;//文章分类

    return LabelModel.find({_id: { $in: articleLabels }}, {_id: 1, name: 1}).exec();
  }).then(function (labels) {
    data.article.labels = labels;//文章标签

    //文章评论信息
    return CommentModel.find({articleID: articleId }, {_id: 1, commentator: 1, accountID:1, headPortrait: 1, content: 1, createdDate: 1, commentParent: 1}).sort({_id: 1}).exec();
  }).then(function (comments) {
    var accountIds = [];
    if (comments) {
      data.article.commentCount = comments.length;
      var items = comments.map(function (item) {
        if(item.accountID){
          accountIds.push(item.accountID);
        }
        return {
          _id: item._id.toString(),
          commentator: item.commentator,
          accountID: item.accountID,
          headPortrait: item.headPortrait,
          content: item.content,
          createdDate: moment(item.createdDate).format('YYYY年MM月DD HH:mm:ss'),
          commentParent: item.commentParent
        };
      });
      // FIXME 文章评论，这里一次性加载，不再分页，后期再考虑分页显示
      // 转换为树形数据，让评论相关联排序
      items = commonMethod.convertTreeNode(items, 'commentParent');
      data.comments = items;
    }

    //评论者头像
    return AccountModel.find({_id: { $in: accountIds}}, {_id: 1, headPortrait: 1, email: 1, site: 1}).exec();
  }).then(function (accounts) {
    var accountMap = {};
    accounts.forEach(function(item){
      accountMap[item._id.toString()] = item.headPortrait;
    });
    data.comments.forEach(function(item){
      if(accountMap[item.accountID]){
        item.headPortrait = accountMap[item.accountID];
      }
    });

    //前一篇文章
    var _conditions = conditions;
    underscore.extend(_conditions, {_id: { $lt: ObjectId(articleId)}});
    return model.findOne(_conditions, {_id: 1, title: 1, articleLink: 1}, {sort: {_id: -1}}).exec();
  }).then(function (article) {
    data.prevArticle = article;//前一篇文章

    //后一篇文章
    var _conditions = conditions;
    underscore.extend(_conditions, {_id: { $gt: ObjectId(articleId)}});
    return model.findOne(_conditions, {_id: 1, title: 1, articleLink: 1}).exec();
  }).then(function (article) {
    data.nextArticle = article;//后一篇文章

    //查询相关文章，目前以文章相关标签为依据来查询
    var _conditions = conditions;
    underscore.extend(_conditions, {_id: {$ne: ObjectId(articleId)}, labels: { $in: articleLabels }});
    return model.find(_conditions, {_id: 1, title: 1, articleLink: 1, createdDate: 1}, {limit: 5}).sort({_id: -1}).exec();
  }).then(function (articles) {
    articles.forEach(function (item) {
      item._doc.createdDate = moment(item._doc.createdDate).format('YYYY年MM月DD HH:mm:ss');
    });
    data.relatedArticle = articles;//相关文章

    return callback(null, data);
  }).then(null, function (err) {
    return callback(err);
  });
};

/**
 * 文章归档列表
 * @param loginName {String} 账户登录名
 * @param month {String} 月份
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.archive = function (loginName, month, callback) {
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, createdMonth: month, publicityStatus: { $ne: 'private' }};
  getArticleList(this.model, conditions, 'archive', month, callback);
};

/**
 * 分类目录文章列表
 * @param loginName {String} 账户登录名
 * @param id {String} 分类目录id
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.category = function (loginName, id, callback) {
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, categories: {$elemMatch: {$in: [id]}}, publicityStatus: { $ne: 'private' }};
  getArticleList(this.model, conditions, 'category', id, callback);
};

/**
 * 标签文章列表
 * @param loginName {String} 账户登录名
 * @param id {String} 标签id
 * @param callback {function} 回调函数
 */
ArticleDao.prototype.label = function (loginName, id, callback) {
  var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, labels: {$elemMatch: {$in: [id]}}, publicityStatus: { $ne: 'private' }};
  // 或者调用以下语句，本地测试成功，但百度开放云有问题，不能正确读出数据
  //var conditions = {account: loginName, status: {$in: ['publish', 'modified']}, labels: {$elemMatch: {$eq: id}}, publicityStatus: { $ne: 'private' }};
  getArticleList(this.model, conditions, 'label', id, callback);
};

/**
 * 首页显示文章列表
 * @param dataPage
 * @param callback
 */
ArticleDao.prototype.boutiqueArticle = function (dataPage, callback) {
  var skip = dataPage.itemsPerPage * (dataPage.currentPage - 1);
  var limit = dataPage.itemsPerPage;
  var model = this.model;
  var conditions = {boutique: true, status: {$in: ['publish', 'modified']}, publicityStatus: { $ne: 'private' }};
  model.count(conditions, function (err, count) {
    if (err === null) {
      dataPage.setTotalItems(count);
      getArticlePagination(model, conditions, skip, limit, {sort: {homeTop: -1, _id: -1}}, dataPage, callback);
    }
  });
};

/**
 * 修改数据
 * @param conditions
 * @param fields
 * @param callback
 */
ArticleDao.prototype.update = function (conditions, fields, callback) {
  this.model.update(conditions, fields, function (err, numberAffected, rawResponse) {
    return callback(err);
  });
};

/**
 * 浏览次数
 * 这里不再判断同一ip访问多次的情况
 * @param articleId
 * @param ip
 * @param browserAgent
 * @param status 文章状态
 * @param callback
 */
ArticleDao.prototype.readCount = function (articleId, ip, browserAgent, status, callback) {
  if(status === 'draft'){
    return callback();
  }
  var model = this.model;
  var entity = new ArticleReadCountModel({articleID: articleId, ip: ip, browserAgent: browserAgent});
  entity.save(function (err, product, numberAffected) {
    if (err) {
      return callback(err);
    } else {
      model.update({_id: articleId}, {$inc: {readCounts: 1}}, function (err, numberAffected, rawResponse) {
        return callback(err);
      });
    }
  });
};

/**
 * 查询受保护的文章密码
 * @param articleId
 * @param callback
 */
ArticleDao.prototype.findArticlePassword = function (articleId, callback) {
  this.model.findById(articleId, {_id: 1, protectedPassword: 1}, function (err, model) {
    callback(err, model);
  });

};

/**
 * 根据条件返回个人文章列表
 * @param model
 * @param conditions 查询条件，条件有标签，目录结构，分档等
 * @param type 标签或分类
 * @param id 标签或分类ID
 * @param callback
 */
function getArticleList(model, conditions, type, id, callback) {
  var articleList = [], categoriesId = [], labelIds = [], articleIds = [], categoryMap = {}, labelMap = {}, commentMap = {};

  var promise = model.find(conditions, {_id: 1, title: 1, content: 1, categories: 1, labels: 1, articleLink: 1, account: 1, readCounts: 1, createdDate: 1}).exec();

  promise.then(function (articles) {
    articleList = articles.map(function (item) {
      var doc = item._doc;
      articleIds.push(doc._id.toString());
      doc.categories.forEach(function (item) {
        categoriesId.push(item);
      });
      doc.labels.forEach(function (item) {
        labelIds.push(item);
      });
      doc.createdDate = moment(doc.createdDate).format('YYYY年MM月DD HH:mm:ss');
      //截取内容
      //var content = commonMethod.htmlToText(doc.content);
      var content = doc.content;
      content = commonMethod.truncate(content, 2000, true, ' <strong>. . .</strong>');
      doc.content = content;
      return doc;
    });

    //查询文章分类
    return CategoryModel.find({_id: { $in: categoriesId }}, {_id: 1, name: 1}).exec();
  }).then(function (categories) {
    categories.forEach(function (item) {
      categoryMap[item._id] = item.name;
    });

    //查询文章标签
    return LabelModel.find({_id: { $in: labelIds }}, {_id: 1, name: 1}).exec();
  }).then(function (labels) {
    labels.forEach(function (item) {
      labelMap[item._id] = item.name;
    });

    //查询评论个数
    return CommentModel.aggregate({$match: {articleID: { $in: articleIds }}}, { $group: { _id: '$articleID', commentCount: { $sum: 1 }}}).exec();
  }).then(function (comments) {
    comments.forEach(function (item) {
      commentMap[item._id] = item.commentCount;
    });

    articleList.forEach(function (item) {
      item.labels = item.labels.map(function (item) {
        return {_id: item, name: labelMap[item]};
      });
      item.categories = item.categories.map(function (item) {
        return {_id: item, name: categoryMap[item]};
      });
      item.commentCount = commentMap[item._id.toString()];
    });
    if (type === 'category') {
      CategoryModel.findById(id, {_id: 1, name: 1}, function (err, model) {
        if (err) {
          throw err;
        } else {
          return callback(null, articleList, model.name);
        }
      });
    } else if (type === 'label') {
      LabelModel.findById(id, {_id: 1, name: 1}, function (err, model) {
        if (err) {
          throw err;
        } else {
          return callback(null, articleList, model.name);
        }
      });
    } else {
      return callback(null, articleList);
    }
  }).then(null, function (err) {
    return callback(err);
  });
}

/**
 * 根据条件返回分页文章列表
 * @param model
 * @param conditions
 * @param skip
 * @param limit
 * @param sort 排序规则
 * @param dataPage 分页数据
 * @param callback
 */
function getArticlePagination(model, conditions, skip, limit, sort, dataPage, callback) {

  var articleList = [], categoriesId = [], labelIds = [], articleIds = [], categoryMap = {}, labelMap = {}, commentMap = {};

  var promise = model.find(conditions, {_id: 1, title: 1, content: 1, categories: 1, labels: 1, account: 1, readCounts: 1, createdDate: 1}, underscore.extend({skip: skip, limit: limit}, sort)).exec();

  promise.then(function (articles) {
    articleList = articles.map(function (item) {
      var doc = item._doc;
      articleIds.push(doc._id.toString());
      doc.categories.forEach(function (item) {
        categoriesId.push(item);
      });
      doc.labels.forEach(function (item) {
        labelIds.push(item);
      });
      doc.createdDate = moment(doc.createdDate).format('YYYY年MM月DD HH:mm:ss');
      //var content = commonMethod.htmlToText(doc.content);
      var content = doc.content;
      content = commonMethod.truncate(content, 1000, true, ' <strong>. . .</strong>');
      doc.content = content;
      return doc;
    });

    //查询文章分类
    return CategoryModel.find({_id: { $in: categoriesId }}, {_id: 1, name: 1}).exec();
  }).then(function (categories) {
    categories.forEach(function (item) {
      categoryMap[item._id] = item.name;
    });

    //查询文章标签
    return LabelModel.find({_id: { $in: labelIds }}, {_id: 1, name: 1}).exec();
  }).then(function (labels) {
    labels.forEach(function (item) {
      labelMap[item._id] = item.name;
    });

    //查询评论个数
    return CommentModel.aggregate({$match: {articleID: { $in: articleIds }}}, { $group: { _id: '$articleID', commentCount: { $sum: 1 }}}).exec();
  }).then(function (comments) {
    comments.forEach(function (item) {
      commentMap[item._id] = item.commentCount;
    });

    articleList.forEach(function (item) {
      item.labels = item.labels.filter(function (it) {
        return !!labelMap[it];
      }).map(function (it) {
        return {_id: it, name: labelMap[it]};
      });
      item.categories = item.categories.filter(function (it) {
        return !!categoryMap[it];
      }).map(function (it) {
        return {_id: it, name: categoryMap[it]};
      });
      item.commentCount = commentMap[item._id.toString()];
    });

    dataPage.setItems(articleList);
    return callback(null, dataPage);

  }).then(null, function (err) {
    return callback(err);
  });
}
