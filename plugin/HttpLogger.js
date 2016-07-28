'use strict';

const Plugin = require('./');

class HttpLogger extends Plugin {
  touch() {
    let message = `[${new Date(this.startAt).format('yyyy-MM-dd hh:mm:ss')}] ${this.request.method} ${this.request.url} ${this.response.status} ${this.finishAt - this.startAt}ms ${this.response.body && this.response.body.message || ''}`;
    if (this.response.status >= 500) {
      console.error(message);
    } else if (this.response.status >= 400) {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
}

module.exports = HttpLogger;

global.PluginRegistry.regist(HttpLogger, {description: 'Deal with http request and print/save some information', tags: ['logger']});