const debug = require('debug')('error');
const PlugitError = require('../utils/PlugitError');

module.exports = function () {
  return function * (next) {
    try {
      yield next;
    } catch (err) {
      debug(err.message);
      this.app.emit('error', err, this);

      if(err instanceof PlugitError) {
        this.status = 400;
        this.body = { error: err.message };
      } else if(this.status < 500) {
        this.body = { error: err.message };
      } else {
        this.status = 500;
        if (err.errors) {
          err.errors.forEach(error => debug(error.message));
        }
        this.body = { error: 'Server internal error' };
      }

    }
  }
};