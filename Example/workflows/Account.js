'use strict';

const {Workflow, Worker} = require('../../');

class Account extends Workflow {
  get create() {
    return [
      new Worker({
        dispatcher: _ => ['Account/create']
      }),
      new Worker({
        componentMap: 'Account/create/Account',
        operation: 'create',
        paramsMaper: payload => [payload.req],
        packager: res => { return { res }; }
      })
    ];
  }

  get list() {
    return [
      new Worker({
        dispatcher: _ => ['Account/list']
      }),
      new Worker({
        componentMap: 'Account/list/Account',
        operation: 'list',
        packager: res => { return { res }; }
      })
    ];
  }

  get updateName() {
    return [
      new Worker({
        dispatcher: _ => ['Account/updateName']
      }),
      new Worker({
        componentMap: 'Account/updateName/Account',
        operation: 'updateName',
        idBinder: payload => payload.req.id,
        paramsMaper: payload => [payload.req.name],
        packager: res => { return { res }; }
      })
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