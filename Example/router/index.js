'use strict';

const router = require('koa-router')();
const jwt = require('koa-jwt');

// router.post('/auth', function* () {
//   let auth = this.req.body;
//   // auth.exp = auth.exp || Math.round((Date.now() + appConfig.jwt.exp) / 1000);
//   // this.body = {jwt: jwt.sign(auth, appConfig.jwt.secret)};
// });

// router.get('/auth', function* () {
//   this.body = this.state.user;
// });

router.use('/accounts', require('./accounts'));

module.exports = router.routes();