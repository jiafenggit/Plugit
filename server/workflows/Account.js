'use strict';

const {Workflow} = require('../../plugit');

class Account extends Workflow {
  get create() {
    return [
      'Account/create/Account',
      function* (component, transaction, {name, password, username}) {
        yield transaction.run({
          component,
          operation: 'create'
        }, { name, password, username });
        return yield component.info();
      }
    ];
  }
  
  get list() {
    return [
      'Account/list/Account',
      function* (component) {
        return yield component.list();
      }
    ];
  }

  get updateName() {
    return [
      'Account/updateName/Account',
      function* (component, transaction, {id, name}) {
        component.id = id;
        yield transaction.run({
          component,
          operation: 'updateName'
        }, name);
        return yield component.info();
      }
    ];
  }
}

module.exports = Account;

//Design the receptacle;
module.exports.componentBlueprints = [
  {
    group: 'Account',
    workflow: 'create',
    receptacle: 'Account',
    type: 'Account',
    description: 'Create an account'
  },
  {
    group: 'Account',
    workflow: 'list',
    receptacle: 'Account',
    type: 'Account',
    description: 'List accounts'
  },
  {
    group: 'Account',
    workflow: 'updateName',
    receptacle: 'Account',
    type: 'Account',
    description: 'Update account name'
  }
];