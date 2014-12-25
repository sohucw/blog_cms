#Hope Future Blog 博客系统

该项目是一个免费blog搭建系统，主要供自己开发学习使用，所以开发过程中会用到时下比较流行的前端开源框架和技术。
另外通过开发该项目，对blog的搭建以及CMS的开发会有更深入的了解，开发过程中会参考国内外开源blog（比如：WordPress）。

##目的和目标
* 搭建一个功能比较齐全，用户体验堪比完美，扩展比较方便的免费blog
* 搭建过程中可以深入研究学习最新技术
* 利用搭建好的免费blog，发布自己总结的相关技术性文章，也可动用其他人参与
* 开发过程中希望能得到用户的意见和反馈
* 上线后可以升级免费版blog，刊登广告，爱心捐助等
* 以开发免费blog积累的知识，开发一套CMS系统（通用的），能快速根据需要定制内容管理系统，该系统基于portal思想实现。
* 利用成熟的技术和平台参与一些开源项目或是外包项目
* 开源blog和icms，并开源一些小组件，比如单元格操作算法等。

##文档结构
* app 存放前端相关html css image javascript 等
* bin express 启动文件
* dist 编译打包路径
* doc 利用jsdoc 生成 javascript 帮助文档
* examples 开发中一些小例子
* jsdoc-templetes jsdoc模板
* publish 发布package.json
* server 后端js文件，主要用express和mongoose来操作mongodb
* test 单元测试文件和e2e测试文件

##开发工具
主要用到以下开发工具：netbeans、webstorm、dreamweaver、Notepad++、markdownpad等

##相关技术
* 项目管理：Grunt Bower Yeoman
* 书写代码辅助工具： emment（快速书写html代码，前身是 zen coding）
* 制定通用、简单的html 、css 和 javascript 规范，可以参考[这里](http://codeguide.bootcss.com/)
* CSS：基于Bootstrap运用less快速开发构建css，掌握常用的css3，并且能用css3工具快速生成code
* Javascript：基于Node.js能熟练构建项目(express, mongoose),  Angular, jQuery
* Javascript 第三方库（包括jQuery插件）：[`jquery-validation`](http://jqueryvalidation.org/)
* Javascript模块化管理开发：选国产Sea.js，使用Sea.js延伸的技术，如： spm。另外也会用到RequireJS，在不同的模块中使用，使之熟悉这两个常用模块化管理库
* 检测Javascript代码工具：JSHint，可以发现代码错误、查找代码潜在的问题以及不规范的写法。
* Html：会多用一些html5相关技术
* 数据库： Mongodb
* 单元测试：grunt + karma + Jasmine，基于Angular 测试
* 端到端（e2e）测试：protractor
* Javascript 文档（doc）规范与生成，方便后期维护和其他开发人员阅读，使用 jsdoc
* 性能优化技术

上面用到的技术或工具会根据实际开发过程中不断补充。

##项目安装、打包、运行，测试等

### 项目运行
前提是安装了最新版的nodejs（\>0.10.x）和mongodb数据库

```
npm install -g bower
npm install -g grunt-cli
npm install
bower install
grunt server
```
### 单元测试
```
grunt test
```
### 端到端（e2e）测试
```
npm install -g protractor
webdriver-manager update // 在项目当前目录下运行
npm run protractor
```
注意端到端测试前，请确保项目是在启动中，参见上面的 ***项目运行***

### 打包编译
```
grunt build
```
### 生成文档
```
grunt generatedoc
```
## 意见和建议以及bug

如果你有好的意见和建议，可以点击[这里](https://github.com/linder0209/hopefuture-blog/issues/new)发表你的看法，
当然你也可以在[这里](https://github.com/linder0209/hopefuture-blog/issues/new)提交bug。

## License

请看 [LICENSE 文件](https://github.com/linder0209/hopefuture-blog/blob/master/LICENSE.md)
