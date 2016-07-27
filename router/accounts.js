'use strict';

let router = require('koa-router')();
let Transaction = require('../transaction');
let ComponentMap = require('../map/ComponentMap');

//Design the receptacle when server start;
const createAccountMap = ComponentMap.design({ receptacle: 'createAccount', type: 'account' });
//Attach the receptacle desinged;
//Init a transaction and set it pendding;
//Try your actions and the transaction will rollback when your actions boom;
//Commit the transaction and make a response;
router.post('/', ComponentMap.middleware.attach(createAccountMap.receptacle), Transaction.middleware.before, Transaction.middleware.try(function* (next) {

  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'create'
  });

  yield action.exec(this.req.body);
  this.body = yield action.instance.info();

  yield next;
}), Transaction.middleware.after);

const listAccountMap = ComponentMap.design({ receptacle: 'listAccount', type: 'account' });
router.get('/', ComponentMap.middleware.attach(listAccountMap.receptacle), function* (next) {
  this.body = yield this.Component.list();
});

const updateAccountNameMap = ComponentMap.design({ receptacle: 'updateAccountName', type: 'account' });
router.put('/:id', ComponentMap.middleware.attach(updateAccountNameMap.receptacle), Transaction.middleware.before, Transaction.middleware.try(function* (next) {
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
}), Transaction.middleware.after);

module.exports = router.routes();