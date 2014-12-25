'use strict';

angular.module('hopefutureBlogApp')
  .factory('settingService', ['hfbHttpService', function (hfbHttpService) {
    return {
      findTheme: function (success) {
        hfbHttpService.get('manage/setting/theme').then(success);
      },
      setTheme: function (themeCode, success) {
        hfbHttpService.post('manage/setting/theme/' + themeCode).then(success);
      }
    };
  }])
  .constant('blogThemes', [
    {
      code: 'blue-classic',
      name: '蓝色经典'
    },
    {
      code: 'spring-tones',// 自定义主题地址：http://getbootstrap.com/customize/?id=97567444cec84ab50d8c
      name: '春天色彩'
    },
    {
      code: 'elegant-style',// 自定义主题地址：http://getbootstrap.com/customize/?id=b07d6e00d1d10e10424c
      name: '典雅风格'
    },
    {
      code: 'romantic-feelings',// 自定义主题地址：http://getbootstrap.com/customize/?id=3ca241f76080d177b6b8
      name: '浪漫情怀'
    },
    {
      code: 'pink-mood',// 自定义主题地址：http://getbootstrap.com/customize/?id=6ba50211ad604748fd0e
      name: '粉色心情'
    },
    {
      code: 'grass-color',// 自定义主题地址：http://getbootstrap.com/customize/?id=ef6b7eb0611315d724f8
      name: '草地气息'
    },
    {
      code: 'sea-tones',// 自定义主题地址：http://getbootstrap.com/customize/?id=583a3050c460e8b9ec59
      name: '海的声音'
    },
    {
      code: 'nature-hues',// 自定义主题地址：http://getbootstrap.com/customize/?id=3a619808b805d2590429
      name: '自然色彩'
    },
    {
      code: 'polar-hues',// 自定义主题地址：http://getbootstrap.com/customize/?id=55c211bf4ce8e62d80fb
      name: '极地风光'
    },
    {
      code: 'global-spectrum',// 自定义主题地址：http://getbootstrap.com/customize/?id=31d9255ad323dae901fc
      name: '光谱色彩'
    },
    {
      code: 'mountains-fog',// 自定义主题地址：http://getbootstrap.com/customize/?id=ddb3f423142d9cdc2936
      name: '山色雾景'
    },
    {
      code: 'flora-brights',// 自定义主题地址：http://getbootstrap.com/customize/?id=2c544f1f03b878e7e1f8
      name: '花儿有毒'
    },
    {
      code: 'purple-rose',// 自定义主题地址：http://getbootstrap.com/customize/?id=bfc6d445a775258237f9
      name: '紫色玫瑰'
    },
    {
      code: 'feathered-hues',// 自定义主题地址：http://getbootstrap.com/customize/?id=ac34e5b7f02e3f0381b3
      name: '美丽羽毛'
    },
    {
      code: 'flora-tones',// 自定义主题地址：http://getbootstrap.com/customize/?id=6af1d66b907daeb0f6c4
      name: '美丽花儿'
    },
    {
      code: 'blue-ocean',// 自定义主题地址：http://getbootstrap.com/customize/?id=9399a21a567574edae24
      name: '蓝色海洋'
    },
    {
      code: 'purple-red',// 自定义主题地址：http://getbootstrap.com/customize/?id=3b0a57e8c94403eb9e09
      name: '大红大紫'
    }
  ]);

