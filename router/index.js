'use strict';

let router = require('koa-router')();

router.use('/accounts', require('./accounts'));

module.exports = router.routes();