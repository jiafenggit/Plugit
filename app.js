'use strict';

const Plugit = require('./plugit');
const path = require('path');

const app = new Plugit({
  hotLoad: {
    paths: [
      path.resolve(__dirname, 'server/components'),
      path.resolve(__dirname, 'server/workflows')
    ]
  }
});

app.start().then(_ => {
  console.log('server start!');
}).catch(e => {
  console.error(e);
});

module.exports = app;
