'use strict';

const rbac = require('koa-rbac');
const router = require('koa-router')();
const ComponentMap = global.ComponentMap;

//Design the receptacle when server start;
const createAccountMap = ComponentMap.design({ group: 'Account', workflow: 'Create account', receptacle: 'Account', type: 'Account', description: 'Create account' });
//Attach the receptacle desinged;
router.post('/', ComponentMap.middleware.attach(createAccountMap), function* (next) {

  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'create',
  }, this.req.body);

  this.body = yield this.component.info();
});

const listAccountMap = ComponentMap.design({ group: 'Account', workflow: 'List accounts', receptacle: 'Account', type: 'Account', description: 'List accounts' });
router.get('/', ComponentMap.middleware.attach(listAccountMap), function* (next) {
  this.body = yield this.component.list();
});

const updateAccountNameMap = ComponentMap.design({ group: 'Account', workflow: 'Update account name', receptacle: 'Account', type: 'Account', description: 'Update account name' });
router.put('/:id', ComponentMap.middleware.attach(updateAccountNameMap), function* (next) {
  const {id} = this.params;
  const {name} = this.req.body;

  this.component.id = id;  
  const action = yield this.transaction.pushAction({
    component: this.component,
    operation: 'updateName'
  }, name);

  this.body = yield this.component.info();
});

module.exports = router.routes();