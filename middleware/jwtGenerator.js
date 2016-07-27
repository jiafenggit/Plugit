'use strict';

const jwt = require('koa-jwt');
const assert = require('assert');

module.exports = ({secret, cookie, exp = 2 * 24 * 3600000} = {}) => {
  assert(secret, 'Invalid secret');
  assert(cookie, 'Invalid cookie key');
  return function* (next) {
    yield next;
    if (this.state.genUser) {
      const expires = Date.now() + (this.state.genUser.exp || exp);
      this.state.genUser.exp = Math.round(expires / 1000);
      this.cookies.set(cookie, jwt.sign(this.state.genUser, secret), {signed: true, expires: new Date(expires)});
    }
  };
};