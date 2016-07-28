'use strict';

const koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-body');
const jwt = require('koa-jwt');

const errorHandler = require('./middleware/errorHandler');
const ignoreAssets = require('./middleware/ignoreAssets');
const logger = require('./middleware/logger');
const jwtGenerator = require('./middleware/jwtGenerator');

const path = require('path');
const appConfig = require('./app.conf.js');
require('./db');
require('./plugitUtil/extension');
// PreLoad all related files to trigger component receptacles design, components registry, plugins registry, plugins receptacles design;
// Do not include any model, app.js, db.js and node_modules!!
require('./plugitUtil/preLoad')(appConfig.preLoad);

const app = koa();

app.keys = ['Plugit', 'I like it!'];
app.use(ignoreAssets(logger()));
app.use(errorHandler);
app.use(serve(__dirname + '/public'));
app.use(jwt({ secret: appConfig.jwt.secret, passthrough: true, cookie: appConfig.jwt.cookie }));
app.use(bodyParser({
  patchNode: true,
  multipart: true
}));
app.use(jwtGenerator(appConfig.jwt));

app.use(require('./plugitUtil/router'));
app.use(require('./router'));

app.on('error', err => {
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
});

app.listen(appConfig.server.port, _ => console.log(`Server start! Listening on ${appConfig.server.port}`));