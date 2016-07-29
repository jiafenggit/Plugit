
'use strict';

const env = process.env.NODE_ENV;

module.exports = {
  server: {
    port: 3000,
  },
  db: {
    host: 'localhost',
    port: 27017,
    name: 'plugit',
    user: '',
    pass: '',
  },
  jwt: {
    secret: 'plugit',
    exp: 3600000
  },
  hotLoad: ['middleware', 'router', 'util']
};