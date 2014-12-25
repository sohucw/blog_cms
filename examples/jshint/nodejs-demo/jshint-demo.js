'use strict';
/**
 * 用命令 jshint --verbose jshint-demo.js 来分析javascript文件，显示警告信息
 */
var object = Object.create(null);
/*jshint -W089 */
//忽略 forin 的校验
for (var prop in object) {
  console.info(prop);
}

function setLevel(number) {
  if (number === 0) {
    return number;
  } else {
    setLevel(--number);
  }
}

