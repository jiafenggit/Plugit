
'use strict';

const env = process.env.NODE_ENV;

module.exports = {
  name: 'Default',
  app: {
    keys: ['Plugit', 'I like it!'],
    errors: true,
    port: 3000,
  },
  database: {
    host: 'localhost',
    port: 27017,
    name: 'plugit',
    options: {
      db: { native_parser: true },
      server: {
        poolSize: 100,
        auto_reconnect: true,
        socketOptions: { keepAlive: 1 }
      },
      user: '',
      pass: '',
    },
    schemas: {}
  },
  jwt: {
    secret: 'plugit',
    exp: 3600000
  },
  bodyParser: {
    patchNode: true,
    multipart: true
  },
  hotLoad: {
    paths: []
  },
  rbac: {
    rules: require('./rbac/rules')
  }
};