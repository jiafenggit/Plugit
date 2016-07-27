'use strict';

const koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-body');
const jwt = require('koa-jwt');

const errorHandler = require('./middleware/errorHandler');
const ignoreAssets = require('./middleware/ignoreAssets');
const logger = require('./middleware/logger');

const appConfig = require('./app.conf.js');
require('./util/extension');
require('./db');
const path = require('path');

const app = koa();

app.use(ignoreAssets(logger()));
app.use(errorHandler);
app.use(serve(__dirname + '/public'));
app.use(jwt({ secret: appConfig.jwt.secretKey, passthrough: true }));
app.use(bodyParser({
  patchNode: true,
  multipart: true
}));

app.use(require('./plugUtil/router'));
app.use(require('./router'));

app.on('error', err => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
});

app.listen(appConfig.server.port, _ => console.log(`Server start! Listening on ${appConfig.server.port}`));