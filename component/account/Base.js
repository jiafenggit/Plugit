'use strict';

const Component = require('../');
const AccountModel = require('../../model/AccountModel');
const ComponentRegistry = require('../../plugUtil/ComponentRegistry');

//Regist the base component of account type;
const componentRegistry = ComponentRegistry.regist({ type: 'account', name: 'Base', description: 'The base component that all account components extends' });
//Regist the operations
componentRegistry.registOperation({ name: '* updateName', args: 'name:String', description: 'Update the name' });

class Account extends Component {

  constructor(id) {
    super(id, AccountModel);
  }

  * updateName(name) {
    yield this._model.findByIdAndUpdate(this._id, {$set: {name}});
  }

}

Account.list = function* (query) {
  return yield AccountModel.find(query);
};

module.exports = Account;