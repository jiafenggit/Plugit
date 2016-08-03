'use strict';

const Plugit = require('../');
const path = require('path');

const name = 'Demo';

new Plugit({
  name,
  app: {
    backendServePath: 'plugit-backend'
  },
  databases: {
    business: {
      host: 'localhost',
      port: 27017,
      name: 'plugit2',
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
  }
}).start().then(_ => {
  global.plugitInstances[name].log('server start!');
}).catch(e => {
  global.plugitInstances[name].error(e);
});