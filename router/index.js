'use strict';

let router = require('koa-router')();

router.post('/login', function* () {
  this.body = null;
  console.log(this.state.user);
  if (!this.state.user) {
    this.state.genUser = this.req.body;
  }
});

router.use('/accounts', require('./accounts'));

module.exports = router.routes();