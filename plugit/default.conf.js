
'use strict';

module.exports = {
  name: 'Default',
  app: {
    keys: ['Plugit', 'I like it!'],
    errors: true,
    port: 3000
  },
  databases: {
    core: {
      host: 'localhost',
      port: 27017,
      name: 'plugit_core'
    },
    history: {
      host: 'localhost',
      port: 27017,
      name: 'plugit_history'
    }
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
    rules: require('./rbac/rules'),
    identity: ctx => {
      if (!ctx.state.user) ctx.throw(401);
      return ctx.state.user;
    }
  },
  cors: {
    enabled: true,
    options: {}
  }
};