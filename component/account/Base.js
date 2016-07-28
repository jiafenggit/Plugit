'use strict';

const Component = require('../');
const AccountModel = require('../../model/AccountModel');

class Base extends Component {

  constructor(id) {
    super(id, AccountModel);
  }

  * updateName(name, transaction) {
    yield this._checkSafe();
    yield this._model.findByIdAndUpdate(this._id, { $set: { name } });
  }

}

Base.list = function* (query) {
  return yield AccountModel.find(query);
};

module.exports = Base;

//Regist the base component of account type;
const componentRegistry = global.ComponentRegistry.regist(Base, { type: 'Account', description: 'The base component that all account components extends' });
//Regist the operations
componentRegistry.registOperation({ name: 'updateName', args: 'name:String', safe: true, description: 'Update the name' });
