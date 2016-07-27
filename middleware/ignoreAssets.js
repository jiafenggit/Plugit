
module.exports = (mw) => {
  return function* (next) {
    if (/(\.js|\.css|\.ico)$|bower_components|font-awesome/.test(this.path)) {
      yield next;
    } else {
      yield mw.bind(this)(next);
    }
  };
};