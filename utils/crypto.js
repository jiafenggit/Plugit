var crypto = require('crypto');

module.exports = {
  md5: function (input) {
    return crypto.createHash('md5').update(input).digest('hex');
  },
  sha256: function (input, key) {
    return crypto.createHmac('sha256', key).update(input).digest('hex');
  }
};