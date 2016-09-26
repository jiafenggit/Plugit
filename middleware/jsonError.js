const debug = require('debug')('error');
const PlugitError = require('../utils/PlugitError');

module.exports = function () {
  return function * (next) {
    try {
      yield next;
    } catch (err) {
      debug(err.message);

      if(err instanceof PlugitError || this.status < 500) {
        this.status = 400;
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