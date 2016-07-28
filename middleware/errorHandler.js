'use strict';

module.exports = function* (next) {
  try {
    yield next;
  } catch (e) {
    this.app.emit('error', e, this);
    this.status = 400;
    this.body = { message: e.message };
    if (e.errors) {
      this.body.message = Object.keys(e.errors).map(key => e.errors[key].message);
    }
  }
};

