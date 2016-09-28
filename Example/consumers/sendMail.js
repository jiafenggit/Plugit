
const debug = require('debug')('consumer');

module.exports = function * ({to, content}) {
  debug(`Begin to send mail to [${to}]`);
  yield new Promise((resolve, reject) => {
    setTimeout(_ => {
      debug(`Send mail to [${to}] with content [${content}]`);
      resolve();
    }, 4000);
  });
};