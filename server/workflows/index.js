'use strict';

const app = require('../../app');
const Plugit = require('../../plugit');

module.exports = {
  createAccount: [

  ]
};

//Design the receptacle;
module.exports.blueprints = [
  {
    group: 'Account',
    workflow: 'Create account',
    receptacle: 'Account',
    type: 'Account',
    description: 'Create an account'
  },
  {
    group: 'Account',
    workflow: 'List accounts',
    receptacle: 'Account',
    type: 'Account',
    description: 'List accounts'
  },
  {
    group: 'Account',
    workflow: 'Update',
    receptacle: 'Account',
    type: 'Account',
    description: 'List accounts'
  }
];