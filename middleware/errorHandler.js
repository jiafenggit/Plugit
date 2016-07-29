'use strict';

module.exports = function* (next) {
  try {
    yield next;
    if (this.status >= 400) this.throw(this.status, this.body);
  } catch (e) {
    this.app.emit('error', e, this);
    this.status = e.status || 400;
    this.body = { error: e.message };
    if (e.errors) {
      this.body.error = Object.keys(e.errors).map(key => e.errors[key].message);
    }
  }
};

