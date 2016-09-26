const mongoose = require('mongoose');
mongoose.Promise = Promise;

const connection = mongoose.createConnection('mongodb://localhost/plugitSungorus');

module.exports = connection;