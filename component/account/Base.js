'use strict';

const Component = require('../');
const AccountModel = require('../../model/AccountModel');

class Account extends Component {

  constructor(id) {
    super(id, AccountModel);
  }

  * updateName(name, transaction) {
    yield this._checkSafe();
    yield this._model.findByIdAndUpdate(this._id, { $set: { name } });
  }

}

Account.list = function* (query) {
  return yield AccountModel.find(query);
};

module.exports = Account;

const ComponentRegistry = require('../../plugitUtil/ComponentRegistry');

//Regist the base component of account type;
const componentRegistry = ComponentRegistry.regist(Account, { type: 'Account', name: 'Base', description: 'The base component that all account components extends' });
//Regist the operations
componentRegistry.registOperation({ name: 'updateName', args: 'name:String', safe: true, description: 'Update the name' });
