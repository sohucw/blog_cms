/**
 * 参考 express官方例子： https://github.com/visionmedia/express/blob/master/examples/auth
 * 详细例子可查看 check out https://github.com/visionmedia/node-pwd
 */

'use strict';

/**
 * Module dependencies.
 */

var crypto = require('crypto');

/**
 * Bytesize.
 */

var len = 128;

/**
 * Iterations. ~300ms
 */

var iterations = 12000;

/**
 * 如果没有传入可选项 salt 表示加密
 * 传入salt 表示返回加密后的密码
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `password` and invoke `fn(err, salt, hash)`.
 *
 * @param {String} password to hash 要加密或解密的密码
 * @param {String} optional salt 密钥
 * @param {Function} callback
 * @api public
 */

exports.hash = function (password, salt, fn) {
  if (3 === arguments.length) {
    if(password === undefined || salt === undefined){
      return fn(new  Error('password or salt is not defined'));
    }
    crypto.pbkdf2(password, salt, iterations, len, function (err, hash) {
      fn(err, hash.toString('base64'));
    });
  } else {
    fn = salt;
    crypto.randomBytes(len, function (err, salt) {
      if (err) {
        return fn(err);
      }
      salt = salt.toString('base64');
      crypto.pbkdf2(password, salt, iterations, len, function (err, hash) {
        if (err) {
          return fn(err);
        }
        fn(null, salt, hash.toString('base64'));
      });
    });
  }
};

exports.encryption = {
  /**
   * 加密
   * @param key
   * @param str
   * @returns {*}
   */
  encrypt: function (key, str) {
    var cipher = crypto.createCipher('aes-256-cbc',key);
    var enc = cipher.update(str,'utf8','hex');
    enc += cipher.final('hex');
    return enc;
  },
  /**
   * 解密
   * @param key
   * @param str
   * @returns {*}
   */
  decrypt: function (key, str) {
    var dec = '';
    try{
      var decipher = crypto.createDecipher('aes-256-cbc', key);
      dec = decipher.update(str, 'hex', 'utf8');
      dec += decipher.final('utf8');
    }catch(e){
      console.error('解密出错：' + e.message);
      throw new Error('解密出错');
    }
    return dec;
  },
  getKey: function () {
    var key = crypto.createDiffieHellman(256).getPrime('base64');
    return key;
  }
};
