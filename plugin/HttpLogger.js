'use strict';

const Plugin = require('./');

class HttpLogger extends Plugin {
  touch() {
    let message = `[${new Date(this.props.startAt).format('yyyy-MM-dd hh:mm:ss')}] ${this.props.request.method} ${this.props.request.url} ${this.props.response.status} ${this.props.finishAt - this.props.startAt}ms ${this.props.response.body && this.props.response.body.message || ''}`;
    if (this.props.response.status >= 500) {
      console.error(message);
    } else if (this.props.response.status >= 400) {
      console.warn(message);
    } else {
      console.log(message);
    }
  }
}

module.exports = HttpLogger;

global.PluginRegistry.regist(HttpLogger, {description: 'Deal with http request and print/save some information', tags: ['logger']});