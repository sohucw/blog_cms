/**
 * Created by linder on 2014/7/31.
 */
'use strict';

angular.module('hopefutureBlogApp')
  .constant('accountInfo', {
    residence: ['北京', '上海', '天津', '重庆', '石家庄', '哈尔滨', '长春', '沈阳', '呼和浩特', '济南',
      '太原', '郑州', '南京', '合肥', '长沙', '南昌', '海口', '广州', '杭州', '南宁', '成都', '武汉', '西安', '银川',
      '兰州', '乌鲁木齐', '西宁', '拉萨', '贵阳', '昆明', '香港', '澳门', '台北'],
    headPortrait: ['head-portrait1', 'head-portrait2', 'head-portrait3', 'head-portrait4', 'head-portrait5',
      'head-portrait6', 'head-portrait7', 'head-portrait8', 'head-portrait9'],
    position: ['CEO/总裁', 'CTO/CIO/技术总监', '部门经理/部门主管', '项目经理/项目主管', '高级软件架构师', '高级软件工程师',
      'Web 前端工程师', '需求分析师', '咨询师', '售前工程师', '软件实施顾问', '软件工程师', '软件测试', '技术支持/维护工程师',
      '系统工程师SA', '数据库DBA', '其他']
  });
