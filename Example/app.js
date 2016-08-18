'use strict';

const Plugit = require('../');
const path = require('path');

const name = 'Demo';

new Plugit({
  name,
  app: {
    port: 4000
  },
  databases: {
    business: {
      host: 'localhost',
      port: 27017,
      name: 'plugit_business',
      // history: {
      //   host: 'localhost',
      //   port: 27017,
      //   name: 'plugit_history'
      // },
      schemas: {
        Account: require('./schemas/Account')
      }
    }
  },
  hotLoad: {
    paths: [
      path.resolve(__dirname, 'components'),
      path.resolve(__dirname, 'workflows'),
      path.resolve(__dirname, 'plugins')
    ]
  },
  router: require('./router'),
  rbac: {
    rules: require('./configurations/RBACRules.json')
  },
  serve: {
    root: path.resolve(__dirname, './public')
  },
  jwt: {
    secret: 'A awesome secret',
    cookie: 'plugit'
  }
}).start().then(_ => {
  global.plugitInstances[name].log('server start!');
}).catch(e => {
  global.plugitInstances[name].error(e);
});
