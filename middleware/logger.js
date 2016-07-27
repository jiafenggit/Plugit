'use strict';

module.exports = function (options) {
  return function* (next) {
    this.startAt = Date.now();
    yield next;
    this.finishAt = Date.now();
    let message = `[${new Date(this.startAt).format('yyyy-MM-dd hh:mm:ss')}] ${this.method} ${this.url} ${this.status} ${this.finishAt - this.startAt}ms ${this.body && this.body.message || ''}`;
    if (this.status >= 500) {
      console.error(message);
    } else if (this.status >= 400) {
      console.warn(message);
    } else {
      console.log(message);
    }
  };
};