'use strict';

const router = require('koa-router')();
const Transaction = require('../plugitUtil/transaction');
const ComponentMap = global.ComponentMap;

//Design the receptacle when server start;
const createAccountMap = ComponentMap.design({ group: 'Account', workflow: 'Create account', receptacle: 'Account', type: 'Account', description: 'Create account' });
//Attach the receptacle desinged;
//Init a transaction and set it pendding;
//Try your actions and the transaction will rollback when your actions boom;
//Commit the transaction and make a response;
router.post('/', Transaction.middleware.inject, ComponentMap.middleware.attach(createAccountMap), function* (next) {

  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'create'
  });

  yield action.exec(this.req.body);
  this.body = yield action.instance.info();

  yield next;
});

const listAccountMap = ComponentMap.design({ group: 'Account', workflow: 'List accounts', receptacle: 'Account', type: 'Account', description: 'List accounts' });
router.get('/', ComponentMap.middleware.attach(listAccountMap), function* (next) {
  this.body = yield this.Component.list();
});

const updateAccountNameMap = ComponentMap.design({ group: 'Account', workflow: 'Update account name', receptacle: 'Account', type: 'Account', description: 'Update account name' });
router.put('/:id', Transaction.middleware.inject, ComponentMap.middleware.attach(updateAccountNameMap), function* (next) {
  const {id} = this.params;
  const {name} = this.req.body;

  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'updateName',
    instance: id
  });

  yield action.exec(name);
  this.body = yield action.instance.info();

  yield next;
});

module.exports = router.routes();