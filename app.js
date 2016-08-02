'use strict';

const Plugit = require('./plugit');
const path = require('path');

new Plugit({
  database: {
    schemas: {
      Account: require('./server/schemas/Account')
    }
  },
  hotLoad: {
    paths: [
      path.resolve(__dirname, 'server/components'),
      path.resolve(__dirname, 'server/workflows')
    ]
  },
  router: require('./server/router')
}).start().then(_ => {
  console.log('server start!');
}).catch(e => {
  console.error(e);
});

const app2 = new Plugit({
  name: 'Plugit2',
  app: {
    port: 3001
  },
  database: {
    name: 'plugit2'
  }
}).start().then(_ => {
  console.log('server2 start!');
}).catch(e => {
  console.error(e);
});