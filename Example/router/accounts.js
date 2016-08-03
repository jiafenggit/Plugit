'use strict';

const rbac = require('koa-rbac');
const router = require('koa-router')();
const AccountWorkflow = require('../workflows/Account');

const accountWorkflow = new AccountWorkflow();

router.post('/', ...accountWorkflow.genMiddleware(accountWorkflow.create));

router.get('/', ...accountWorkflow.genMiddleware(accountWorkflow.list));

router.put('/:id', ...accountWorkflow.genMiddleware(accountWorkflow.updateName));

module.exports = router.routes();

