// Generated on 2014-03-17 using generator-angular 0.7.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // Load grunt tasks automatically
  // 自动加载grunt tasks
  // https://github.com/sindresorhus/load-grunt-tasks
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  // 统计显示各任务执行的时间
  // https://github.com/sindresorhus/time-grunt
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      server: 'server',
      publish: 'publish',
      webapp: 'dist/webapp',
      version: require('./package.json').version || '0.0.1'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '35729'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
      express: {
        files: [ 'app.js', '<%= yeoman.server %>/**/*.js' ],
        tasks: [ 'express:dev' ],
        options: {
          spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
        }
      },
      less: {
        files: ['<%= yeoman.app %>/less/{,*/}*.less'],
        tasks: ['less']
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),//利用插件jshint-stylish输出分析结果
        reporterOutput: 'jshint.log'//设置分析结果输出到指定文件，如果不设置，则输出到控制台
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js',
        '<%= yeoman.server %>/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*',
              '!<%= yeoman.dist %>/node_modules/**'
            ]
          }
        ]
      },
      server: '.tmp',
      jsdoc: {
        options: {
          force: true
        },
        files: [
          {
            dot: true,
            src: [
              '.tmp/jsdoc'
            ]
          }
        ]
      }
    },

    // Add vendor prefixed styles
    // 该任务用来分析css并为css3加上各浏览器前缀
    autoprefixer: {
      options: {
        //cascade: true,// 设置层叠显示分格
        browsers: ['last 1 version']// 指定浏览器版本，该设置表示浏览器最新版本，详见 https://github.com/ai/autoprefixer#browsers
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',// 指定当前文件夹
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },

    // Automatically inject Bower components into the app
    // 由于项目中不同的文件加载的bower 组件不一样，故有些html文件去掉了bower install
    wiredep: {
      options: {
        dependencies: true,
        devDependencies: false,
        exclude: [],
        fileTypes: {},
        ignorePath: ''// /\.\.\//
      },
      app: {
        src: [
          '<%= yeoman.app %>/examples/**/*.html',
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/account/**/*.html',
          '<%= yeoman.app %>/blog/**/*.html',
          '<%= yeoman.app %>/errors/**/*.html'
        ]
      }
    },

    // Renames files for browser caching purposes
    // 该任务用来重新命名文件
    filerev: {
      dist: {
        src: [
          '<%= yeoman.webapp %>/scripts/{,*/}*.js',
          '<%= yeoman.webapp %>/styles/{,**/}*.css',
          '<%= yeoman.webapp %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.webapp %>/fonts/*',
          '<%= yeoman.webapp %>/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    // 注意不同的文件应该命名不同的编译名称，比如两个html文件中不能出现相同的build:js 名称
    // 该task 会生成 concat、uglify、cssmin 配置项，随后利用这几个命令来处理转换文件，处理html中类似以下定义的块
    /**
     * <!-- build:js js/app.js -->
     <script src="js/app.js"></script>
     <script src="js/controllers/thing-controller.js"></script>
     <script src="js/models/thing-model.js"></script>
     <script src="js/views/thing-view.js"></script>
     <!-- endbuild -->
     **/
    useminPrepare: {
      app1: {
        options: {
          dest: '<%= yeoman.webapp %>'//输出路径
        },
        src: [
          '<%= yeoman.app %>/*.html'
        ]
      },
      app2: {
        options: {
          staging: '.tmp/usemin',
          dest: '<%= yeoman.webapp %>/account'//输出路径
        },
        src: [
          '<%= yeoman.app %>/account/*.html',
          '<%= yeoman.app %>/blog/*.html',
          '<%= yeoman.app %>/errors/*.html',
          '<%= yeoman.app %>/examples/*.html',
          '<%= yeoman.app %>/themes/*.html'
        ]
      },
      app3: {
        options: {
          staging: '.tmp/usemin/usemin',
          dest: '<%= yeoman.webapp %>/account/*'//输出路径
        },
        src: [
          '<%= yeoman.app %>/account/activate/*.html',
          '<%= yeoman.app %>/account/reset-password/*.html',
          '<%= yeoman.app %>/themes/themes/*.html'
        ]
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: [
        '<%= yeoman.webapp %>/{,**/}*.html',
        '!<%= yeoman.webapp %>/views/{,*/}*.html'
      ],
      css: ['<%= yeoman.webapp %>/styles/{,**/}*.css'],
      options: {
        //assetsDirs: ['<%= yeoman.webapp %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [
          {
            expand: true,// Enable dynamic expansion
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= yeoman.webapp %>/images'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.webapp %>/images'
          }
        ]
      }
    },
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,// 合并多余的空格
          collapseBooleanAttributes: true,// Collapse boolean attributes. <input disabled="disabled"> => <input disabled>
          removeCommentsFromCDATA: true,//删除script 和style中的注解
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.webapp %>',
            src: ['*.html', 'views/{,*/}*.html', 'account/{,*/}*.html', 'blog/*.html', 'errors/*.html',
              'examples/*.html', 'themes/{,*/}*.html'],
            dest: '<%= yeoman.webapp %>'
          }
        ]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    // FIXME 该grunt 任务有 bug，对 service-publish.js 中的publishMethod没有自动加入
    ngmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '*.js',
            dest: '.tmp/concat/scripts'
          },
          {
            expand: true,
            cwd: '.tmp/usemin/scripts',
            src: '*.js',
            dest: '.tmp/usemin/scripts'
          }
        ]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: [
          '<%= yeoman.webapp %>/*.html'
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= yeoman.app %>',
            dest: '<%= yeoman.webapp %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'views/{,*/}*.html',
              'account/{,*/}*.html',
              'blog/{,*/}*.html',
              'errors/{,*/}*.html',
              'examples/{,*/}*.html',
              'themes/{,*/}*.html',
              'images/{,*/}*.{webp}',
              'fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.webapp %>/images',
            src: ['generated/*']
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/bower_components/bootstrap/dist',
            src: 'fonts/*',
            dest: '<%= yeoman.webapp %>/styles'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/bower_components/fontawesome',
            src: 'fonts/*',
            dest: '<%= yeoman.webapp %>'
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/bower_components/tinymce-syntaxhighlighter',
            src: 'images/*',
            dest: '<%= yeoman.webapp %>'
          },
          {
            expand: true,
            cwd: './',
            dest: '<%= yeoman.dist %>',
            src: [
              '<%= yeoman.server %>/**'
            ]
          },
          {
            expand: true,
            cwd: '<%= yeoman.publish %>',
            dest: '<%= yeoman.dist %>',
            src: ['**']
          },
          {
            expand: true,
            cwd: 'bin',
            dest: '<%= yeoman.dist %>/bin',
            src: ['**']
          }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,**/}*.css'
      },
      tinymce: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.app %>/bower_components/tinymce',
            dest: '<%= yeoman.webapp %>/scripts',
            src: ['plugins/*/*.js', 'themes/*/*.js', 'skins/**', '!plugins/*/*.min.js', '!themes/*/*.min.js']
          },
          {
            expand: true,
            cwd: '<%= yeoman.app %>/styles',
            dest: '<%= yeoman.webapp %>/styles',
            src: ['tinymce.css']
          }
        ]
      },
      syntaxHighlighter: {
        expand: true,
        cwd: '<%= yeoman.app %>/bower_components/SyntaxHighlighter/scripts',
        src: ['**', '!XRegExp.js', '!shCore.js', '!shAutoloader.js'],
        dest: '<%= yeoman.webapp %>/scripts/syntaxHighlighter'
      },
      stylesThemes: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles-themes',
        src: ['**'],
        dest: '<%= yeoman.app %>/styles'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      examples: {
        configFile: './examples/jasmine/grunt-karma-jasmine/karma.conf.js',
        singleRun: true
      }
    },

    // express 启动任务
    express: {
      options: {
        port: 9000
      },
      dev: {
        options: {
          script: './bin/hopefuture-blog.js'
        }
      }
    },

    // 把less 转换为 css 任务
    less: {
      options: {
        paths: ['<%= yeoman.app %>/']
      },
      examples: {
        files: {
          '<%= yeoman.app %>/styles/examples.css': '<%= yeoman.app %>/less/examples.less'
        }
      },
      springTones: {
        files: {
          '<%= yeoman.app %>/styles/spring-tones/blog.css': '<%= yeoman.app %>/less/blog-spring-tones.less',
          '<%= yeoman.app %>/styles/spring-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-spring-tones.less'
        }
      },
      blueClassic: {
        files: {
          '<%= yeoman.app %>/styles/blue-classic/blog.css': '<%= yeoman.app %>/less/blog-blue-classic.less',
          '<%= yeoman.app %>/styles/blue-classic/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-blue-classic.less'
        }
      },
      grassColor: {
        files: {
          '<%= yeoman.app %>/styles/grass-color/blog.css': '<%= yeoman.app %>/less/blog-grass-color.less',
          '<%= yeoman.app %>/styles/grass-color/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-grass-color.less'
        }
      },
      seaTones: {
        files: {
          '<%= yeoman.app %>/styles/sea-tones/blog.css': '<%= yeoman.app %>/less/blog-sea-tones.less',
          '<%= yeoman.app %>/styles/sea-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-sea-tones.less'
        }
      },
      natureHues: {
        files: {
          '<%= yeoman.app %>/styles/nature-hues/blog.css': '<%= yeoman.app %>/less/blog-nature-hues.less',
          '<%= yeoman.app %>/styles/nature-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-nature-hues.less'
        }
      },
      polarHues: {
        files: {
          '<%= yeoman.app %>/styles/polar-hues/blog.css': '<%= yeoman.app %>/less/blog-polar-hues.less',
          '<%= yeoman.app %>/styles/polar-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-polar-hues.less'
        }
      },
      globalSpectrum: {
        files: {
          '<%= yeoman.app %>/styles/global-spectrum/blog.css': '<%= yeoman.app %>/less/blog-global-spectrum.less',
          '<%= yeoman.app %>/styles/global-spectrum/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-global-spectrum.less'
        }
      },
      mountainsFog: {
        files: {
          '<%= yeoman.app %>/styles/mountains-fog/blog.css': '<%= yeoman.app %>/less/blog-mountains-fog.less',
          '<%= yeoman.app %>/styles/mountains-fog/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-mountains-fog.less'
        }
      },
      floraBrights: {
        files: {
          '<%= yeoman.app %>/styles/flora-brights/blog.css': '<%= yeoman.app %>/less/blog-flora-brights.less',
          '<%= yeoman.app %>/styles/flora-brights/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-flora-brights.less'
        }
      },

      purpleRose: {
        files: {
          '<%= yeoman.app %>/styles/purple-rose/blog.css': '<%= yeoman.app %>/less/blog-purple-rose.less',
          '<%= yeoman.app %>/styles/purple-rose/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-purple-rose.less'
        }
      },
      featheredHues: {
        files: {
          '<%= yeoman.app %>/styles/feathered-hues/blog.css': '<%= yeoman.app %>/less/blog-feathered-hues.less',
          '<%= yeoman.app %>/styles/feathered-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-feathered-hues.less'
        }
      },
      floraTones: {
        files: {
          '<%= yeoman.app %>/styles/flora-tones/blog.css': '<%= yeoman.app %>/less/blog-flora-tones.less',
          '<%= yeoman.app %>/styles/flora-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-flora-tones.less'
        }
      },
      romanticFeelings: {
        files: {
          '<%= yeoman.app %>/styles/romantic-feelings/blog.css': '<%= yeoman.app %>/less/blog-romantic-feelings.less',
          '<%= yeoman.app %>/styles/romantic-feelings/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-romantic-feelings.less'
        }
      },
      blueOcean: {
        files: {
          '<%= yeoman.app %>/styles/blue-ocean/blog.css': '<%= yeoman.app %>/less/blog-blue-ocean.less',
          '<%= yeoman.app %>/styles/blue-ocean/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-blue-ocean.less'
        }
      },
      pinkMood: {
        files: {
          '<%= yeoman.app %>/styles/pink-mood/blog.css': '<%= yeoman.app %>/less/blog-pink-mood.less',
          '<%= yeoman.app %>/styles/pink-mood/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-pink-mood.less'
        }
      },
      purpleRed: {
        files: {
          '<%= yeoman.app %>/styles/purple-red/blog.css': '<%= yeoman.app %>/less/blog-purple-red.less',
          '<%= yeoman.app %>/styles/purple-red/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-purple-red.less'
        }
      },
      elegantStyle: {
        files: {
          '<%= yeoman.app %>/styles/elegant-style/blog.css': '<%= yeoman.app %>/less/blog-elegant-style.less',
          '<%= yeoman.app %>/styles/elegant-style/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-elegant-style.less'
        }
      },

      publish: {
        options: {
          paths: ['<%= yeoman.app %>/']
        },
        files: {
          '<%= yeoman.app %>/styles/spring-tones/blog.css': '<%= yeoman.app %>/less/blog-spring-tones.less',
          '<%= yeoman.app %>/styles/spring-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-spring-tones.less',
          '<%= yeoman.app %>/styles/blue-classic/blog.css': '<%= yeoman.app %>/less/blog-blue-classic.less',
          '<%= yeoman.app %>/styles/blue-classic/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-blue-classic.less',
          '<%= yeoman.app %>/styles/grass-color/blog.css': '<%= yeoman.app %>/less/blog-grass-color.less',
          '<%= yeoman.app %>/styles/grass-color/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-grass-color.less',
          '<%= yeoman.app %>/styles/sea-tones/blog.css': '<%= yeoman.app %>/less/blog-sea-tones.less',
          '<%= yeoman.app %>/styles/sea-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-sea-tones.less',
          '<%= yeoman.app %>/styles/nature-hues/blog.css': '<%= yeoman.app %>/less/blog-nature-hues.less',
          '<%= yeoman.app %>/styles/nature-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-nature-hues.less',
          '<%= yeoman.app %>/styles/tinymce.css': '<%= yeoman.app %>/less/tinymce.less',
          '<%= yeoman.app %>/styles/polar-hues/blog.css': '<%= yeoman.app %>/less/blog-polar-hues.less',
          '<%= yeoman.app %>/styles/polar-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-polar-hues.less',
          '<%= yeoman.app %>/styles/global-spectrum/blog.css': '<%= yeoman.app %>/less/blog-global-spectrum.less',
          '<%= yeoman.app %>/styles/global-spectrum/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-global-spectrum.less',
          '<%= yeoman.app %>/styles/mountains-fog/blog.css': '<%= yeoman.app %>/less/blog-mountains-fog.less',
          '<%= yeoman.app %>/styles/mountains-fog/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-mountains-fog.less',
          '<%= yeoman.app %>/styles/flora-brights/blog.css': '<%= yeoman.app %>/less/blog-flora-brights.less',
          '<%= yeoman.app %>/styles/flora-brights/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-flora-brights.less',
          '<%= yeoman.app %>/styles/purple-rose/blog.css': '<%= yeoman.app %>/less/blog-purple-rose.less',
          '<%= yeoman.app %>/styles/purple-rose/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-purple-rose.less',
          '<%= yeoman.app %>/styles/feathered-hues/blog.css': '<%= yeoman.app %>/less/blog-feathered-hues.less',
          '<%= yeoman.app %>/styles/feathered-hues/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-feathered-hues.less',
          '<%= yeoman.app %>/styles/flora-tones/blog.css': '<%= yeoman.app %>/less/blog-flora-tones.less',
          '<%= yeoman.app %>/styles/flora-tones/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-flora-tones.less',
          '<%= yeoman.app %>/styles/romantic-feelings/blog.css': '<%= yeoman.app %>/less/blog-romantic-feelings.less',
          '<%= yeoman.app %>/styles/romantic-feelings/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-romantic-feelings.less',
          '<%= yeoman.app %>/styles/blue-ocean/blog.css': '<%= yeoman.app %>/less/blog-blue-ocean.less',
          '<%= yeoman.app %>/styles/blue-ocean/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-blue-ocean.less',
          '<%= yeoman.app %>/styles/pink-mood/blog.css': '<%= yeoman.app %>/less/blog-pink-mood.less',
          '<%= yeoman.app %>/styles/pink-mood/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-pink-mood.less',
          '<%= yeoman.app %>/styles/purple-red/blog.css': '<%= yeoman.app %>/less/blog-purple-red.less',
          '<%= yeoman.app %>/styles/purple-red/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-purple-red.less',
          '<%= yeoman.app %>/styles/elegant-style/blog.css': '<%= yeoman.app %>/less/blog-elegant-style.less',
          '<%= yeoman.app %>/styles/elegant-style/blog-manage.css': '<%= yeoman.app %>/less/blog-manage-elegant-style.less'
        }
      }
    },

    /**
     * javascript API 生成器 任务
     * 以下是几个模板，个人觉得 docstrap 模板 不错

     docstrap 模板
     template: 'jsdoc-templetes/ink-docstrap/template',
     configure: 'jsdoc-templetes/ink-docstrap/template/jsdoc.conf.json'

     Jaguar 模板
     template: 'jsdoc-templetes/jaguar',
     configure: 'jsdoc-templetes/jaguar/conf.json'

     jsdoc3Template 模板，本地运行有问题，待研究
     template: 'jsdoc-templetes/jsdoc3Template'
     */
    jsdoc: {
      examples: {
        src: ['examples/jsdoc/src/*.js'],
        options: {
          destination: 'examples/jsdoc/doc',
          template: 'jsdoc-templetes/ink-docstrap/template',
          configure: 'jsdoc-templetes/ink-docstrap/template/jsdoc.conf.json'
        }
      },
      app: {
        src: ['.tmp/jsdoc/app/scripts/**/*.js'],
        options: {
          destination: 'doc/app',
          template: 'jsdoc-templetes/ink-docstrap/template',
          configure: 'jsdoc-templetes/ink-docstrap/template/jsdoc.conf.json'
        }
      },
      server: {
        src: ['.tmp/jsdoc/server/**/*.js'],
        options: {
          destination: 'doc/server',
          template: 'jsdoc-templetes/ink-docstrap/template',
          configure: 'jsdoc-templetes/ink-docstrap/template/jsdoc.conf.json'
        }
      }
    },

    /**
     * 替换文件中的内容
     * 默认会替换@@开头指定的内容，我们可以用option prefix 来改变，也可以用 usePrefix 禁用替换@@开头的内容，而设为替换任意指定的内容
     * 支持正则表达式
     * 这里顺便说一下参数 expand: true, flatten: true,
     * expand 表示展开，flatten设为false表示按照源文件的目录结构copy，设为true会把所有文件copy到一个文件夹下
     */
    replace: {
      app: {
        options: {
          usePrefix: false,// Default: true And  prefix Default: @@
          patterns: [
            {
              match: 'environment = \'development\'',
              replacement: 'environment = \'production\''
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['app.js'], dest: 'dist/'}
        ]
      },
      version: {
        options: {
          force: true,
          patterns: [
            {
              match: 'currentVersion',
              replacement: '<%= yeoman.version %>'
            }
          ]
        },
        files: [
          {expand: true, src: ['<%= yeoman.server %>/**/*.js', '<%= yeoman.app %>/scripts/**/*.js'], dest: '.tmp/jsdoc/'}
        ]
      }
    },

    /**
     * 压缩server js
     **/
    uglify: {
      app: {
        files: [
          {
            expand: true,
            cwd: '<%= yeoman.dist %>/server',
            src: '**/*.js',
            dest: '<%= yeoman.dist %>/server'
          },
          {
            expand: true,
            cwd: '<%= yeoman.webapp %>/scripts',
            src: ['plugins/*/*.js', 'themes/*/*.js'],
            dest: '<%= yeoman.webapp %>/scripts'
          },
          {
            expand: true,
            cwd: '<%= yeoman.webapp %>/scripts/syntaxHighlighter',
            src: ['*.js'],
            dest: '<%= yeoman.webapp %>/scripts/syntaxHighlighter'
          }
        ]
      }
    }
  });

  //例子，注册一个 Task
  grunt.registerTask('foo', 'A sample task that logs stuff.', function (arg1, arg2) {
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ", no args");
    } else {
      grunt.log.writeln(this.name + ", " + arg1 + " " + arg2);
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build']);
    }

    grunt.task.run([
      'clean:server', // clean .tmp
      'wiredep',
      'copy:stylesThemes',// copy 主题样式
      'less:publish',//把less转换为css
      'concurrent:server',// 把样式copy到临时目录中
      'autoprefixer',// 分析css 并给css3加上浏览器前缀
      'express:dev',// 启动 express
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'karma:unit'
  ]);

  grunt.registerTask('build', [
    'clean:dist',// clean dist
    'wiredep',
    'copy:stylesThemes',// copy 主题样式
    'less:publish',//把less转换为css
    'useminPrepare',//合并压缩文件
    'concurrent:dist',//copy css image 和 svg
    'autoprefixer',// 分析css 并给css3加上浏览器前缀
    'concat',// 用 useminPrepare 生成的 concat config 连接文件
    'ngmin',// 处理angular 在 .tmp下
    'copy:dist',// copy 文件
    //'cdnify',// 处理 google cdn，由于执行该task会报错，故暂先注掉
    'cssmin',// 用 useminPrepare 生成的 cssmin config 压缩 css
    'uglify:generated',// 用 useminPrepare 生成的 uglify config 压缩 js
    'filerev',// 重新命名文件名，在 webapp下
    'usemin', // 用重新命名的压缩文件替换
    'replace:app',//替换文件
    'htmlmin', // 处理html文件（删除多余的代码，包括空格和换行，注释等）
    'copy:tinymce',//复制 tinymce 插件、主题和皮肤
    'copy:syntaxHighlighter',//复制 SyntaxHighlighter Brush
    'uglify:app'// 压缩 tinymce 插件和主题、server文件、SyntaxHighlighter Brush
  ]);

  grunt.registerTask('generatedoc', [
    'clean:jsdoc',
    'replace:version',
    'jsdoc:server',
    'jsdoc:app'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  /**
   * 以下任务为开发过程中测试用
   */
  grunt.registerTask('buildless', [
    'less:publish'
  ]);

  grunt.registerTask('buildjsdoc', [
    'jsdoc:examples'
  ]);

  grunt.registerTask('unitexamples', [
    'karma:examples'
  ]);
};
