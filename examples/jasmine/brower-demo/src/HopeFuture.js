'use strict';

function HopeFuture() {
}
HopeFuture.prototype.play = function (name) {
  this.name = name;
};

HopeFuture.prototype.getName = function () {
  return this.name;
};

HopeFuture.prototype.setName = function (name) {
  this.name = name;
};

HopeFuture.prototype.setBlog = function (blog) {
  this.currentBlog = blog;
};

HopeFuture.prototype.add = function (a, b) {
  return a + b;
};