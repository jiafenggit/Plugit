
module.exports = (mw) => {
  return function* (next) {
    if (/(\.js|\.css|\.ico)$|bower_components|font-awesome/.test(this.path)) {
      yield next;
    } else {
      // must .call() to explicitly set the receiver
      // so that "this" remains the koa Context
      yield mw.call(this, next);
    }
  };
};