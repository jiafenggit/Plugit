'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const appConfig = require('./app.conf.js');

let conn = mongoose.createConnection();

const options = {
  db: { native_parser: true },
  server: {
    poolSize: 100,
    auto_reconnect: true,
    socketOptions: { keepAlive: 1 }
  },
  user: appConfig.db.user,
  pass: appConfig.db.pass
};

conn.open(appConfig.db.host, appConfig.db.name, appConfig.db.port, options);

conn.on('error', err => {
  console.error(err);
  conn.close();
});
conn.on('close', _ => {
  console.log('Database closed!');
});
conn.on('connected', () => {
  console.log('Database has connected!');
});

module.exports = conn;

const mongooseTimestamp = require('mongoose-timestamp');
const mongooseRollbackable = require('./transaction/mongoose-rollbackable');
const uniqueValidator = require('mongoose-unique-validator');

mongoose.plugin(mongooseTimestamp);
mongoose.plugin(mongooseRollbackable);
mongoose.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
