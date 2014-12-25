# HEAD

以下会记录项目开发过程中每个版本相关信息

##version 0.0.0 开启项目 (2014-3-13)

* 制定开发目的和目标
* 选用相关技术
* 搭建项目框架
* 参考同类产品

##version 0.0.1  搭建基本框架(2014-3-28)

* 用 yeoman 搭建 基于 angular 项目
* 使用后台 express
* 加入 grunt express task
* 修改Gruntfile.js文件，watch express 代码，grunt build express

##version 0.0.2  完善项目基本框架(2014-5-9)

* 调整文件夹 app 编译（build）后放到 webapp 目录下
* 完善 grunt 相关任务帮助文档
* 整合 mongodb 数据库
* 加入 Angular UI Bootstrap
* 加入对 less 的支持，并整合 grunt-contrib-less 任务
* 实现项目简单例子
    1. 分页显示例子，url相对路径为 example-pagination/
    2. 基本Grid 列表，url相对路径为 example-grid/
* 整合 grunt-jsdoc ，并生成 doc 帮助文档（基于angular书写的代码没有完成，待找到合适的专门用来生成angular文档的插件补上）
* 前端测试
    1. 单元测试， grunt + karma + Jasmine
    2. 端对端（e2e）测试， protractor

##version 0.1.0  进一步完善项目基本框架，使之成为一个通用的项目框架(2014-5-19)

* 升级[express](http://expressjs.com/)到4.x
* 支持url上下文部署（没有解决，先不考虑这个，利用相对路径来开发）
* 引入javascript模块化管理，可以用 [RequireJS](http://www.requirejs.org/)  或 [Sea.js](http://seajs.org/docs/)。

`generator-angular` 结构不太适合模块化管理，我们可以安装 `npm install -g generator-angular-require` ，然后用 `yo angular-require [app-name] `
来生成基于 angular 和 require的项目框架。我们也可以用 `npm install -g generator-angular-with-require yo angular-with-require` 来生成项目框架
* 调试的使用（包括开发和测试的调试），具体开发中补充
*  **后续会基于该分支创建基于angular和require（seajs）的项目基本框架**

##version 0.2.0  开发Blog相关功能，初步实现一个比较完整的Blog(2014-9-4)

* 用户注册
* 用户登录
* 实现博客后台管理，主要包括以下内容
   1. 发布文章：目前只实现了富文本（tinyMCE）编辑器发布文章，下个版本会加入 `Markdown` 编辑器发布文章，同时也会加入支持文章目录生成功能。
   2. 文章管理：包括文章的编辑、删除等
   3. 分类（栏目）管理
   4. 标签管理
   5. 评论管理
   6. 资源链接：主要添加一些学习参考资源链接，可以按分类添加
   7. 博客设置：目前只实现换肤功能（支持多种皮肤）
   8. 编辑用户信息
* 博客首页，没有按栏目展示文章，只是简单的罗列了一些精品文章
* 个人博客，主要包括个人信息，以及按分类显示文章信息，有
   1. 文章列表
   2. 最热文章
   3. 近期文章
   4. 文章归档
   5. 分类目录
   6. 标签
   7. 近期评论
   8. 资源链接
* 学习参考
* 关于

##version 0.2.1  修改Blog相关bug(2014-9-9)

* 切换到发布文章时，tinyMCE 有时不能加载
* 修改登录页面tabindex的顺序
* 解决在百度开放云平台不能修改文章的bug，问题主要是因为修改文章的时候，设置了 _id，可调用以下代码处理 `delete data._id;`
* 在文章详细页面中加入分享功能
* 解决删除文章时，修改标签count出错的bug
* 修改皮肤样式，给登录页和注册页表单加入背景
* 修复当删除标签或分类时没有处理文章已包含的这些标签或分类
* 添加文章或修改文章时，添加分类校验修改为延迟请求并且利用方法 abort() 取消上一次已发送的请求
* 修改评论者头像显示不正确的bug
* 升级相关依赖包

##version 0.2.2  完善Blog，修复Blog bug(2014-9-15)

* 删除多余文件
* 调整styles themes
* 解决 ngmin 对部分文件不能自动转换为安全的压缩前js代码的bug，比如：`service-publish.js 中的 publishMethod`
* 修复 不能修改用户信息bug
* 调整部分显示样式
* 修复注册的账户激活时出错
* 修复非法页面没有正确加载皮肤
* 修复文章详细页面前一篇、后一篇文章读取错误
* 添加和删除分类目录时，返回的分类目录不正确，已修复
* 调整文章归档、分类目录等文章列表显示没有高亮代码
* 调整文章浏览次数算法，每次访问都会自动加一，不再检测ip

##version 0.3.0  运动-强壮的(2014-10-31)
* 修改tinyMCE 全屏时层叠的问题
* 修改文章显示样式
* 文章显示支持style样式
* 修改忘记密码和重置密码的bug
* 为资源链接添加tooltip提示信息
* 支持文章目录生成
* 修复bug：文章修改时公开度和发布方式显示不正确
* 格式化文章代码，一次性加载 brushes
* 解决文章内容太长时，报 "Request Entity Too Large" 错误，设置以下代码：app.use(bodyParser({limit: '10mb'}));
* 升级npm和bower
* 修复其他bug

##version 0.3.1  老鼠-进拓
* 加入markdown支持（未完成）
* 后台启动定时发布新闻功能（未完成）
* 自动保存功能（未完成）
