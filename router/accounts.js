'use strict';

const router = require('koa-router')();
const Transaction = require('../plugitUtil/transaction');
const ComponentMap = require('../plugitUtil/ComponentMap');

//Design the receptacle when server start;
const createAccountMap = ComponentMap.design({ receptacle: 'createAccount', type: 'Account' });
//Attach the receptacle desinged;
//Init a transaction and set it pendding;
//Try your actions and the transaction will rollback when your actions boom;
//Commit the transaction and make a response;
router.post('/', Transaction.middleware.inject, ComponentMap.middleware.attach(createAccountMap.receptacle), function* (next) {

  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'create'
  });

  yield action.exec(this.req.body);
  this.body = yield action.instance.info();

  yield next;
});

const listAccountMap = ComponentMap.design({ receptacle: 'listAccount', type: 'Account' });
router.get('/', ComponentMap.middleware.attach(listAccountMap.receptacle), function* (next) {
  this.body = yield this.Component.list();
});

const updateAccountNameMap = ComponentMap.design({ receptacle: 'updateAccountName', type: 'Account' });
router.put('/:id', Transaction.middleware.inject, ComponentMap.middleware.attach(updateAccountNameMap.receptacle), function* (next) {
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