
'use strict';

module.exports = {
  // APP name
  name: 'Default',
  // Koa app config
  app: {
    keys: ['Plugit', 'I like it!'],
    errors: true,
    port: 3000
  },
  // Enable automatic generate history model
  enableHistory: true,
  // Databases options
  databases: {
    // Plugit core data
    core: {
      host: 'localhost',
      port: 27017,
      name: 'plugit_core'
    },
    // If enable history, history data will save in database
    history: {
      host: 'localhost',
      port: 27017,
      name: 'plugit_history'
    }
  },
  // JWT authorization
  jwt: {
    secret: 'plugit',
    passthrough: true,
    exp: 3600000 * 24 * 14,
    plugitExp: 3600000
  },
  // Body parser
  bodyParser: {
    patchNode: true,
    multipart: true
  },
  // The paths should watch by hotLoader, for hot load modules
  hotLoad: {
    paths: []
  },
  // RBAC options
  rbac: {
    rules: require('./rbac/rules'),
    identity: ctx => {
      if (!ctx.state.user) ctx.throw(401);
      return ctx.state.user;
    }
  },
  // CORS options
  cors: {
    enabled: true,
    options: {}
  },
  // Business router
  router: null,
  // Business serve path
  serve: null
};