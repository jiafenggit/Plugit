'use strict';

const rbac = require('koa-rbac');
const router = require('koa-router')();
const AccountWorkflow = require('../workflows/Account');

const accountWorkflow = new AccountWorkflow();

router.post('/', ...accountWorkflow.middleware('create'));

router.get('/', ...accountWorkflow.middleware('list'));

router.put('/:id', ...accountWorkflow.middleware('updateName'));

router.get('/:id/histories', ...accountWorkflow.middleware('histories'));

module.exports = router.routes();
