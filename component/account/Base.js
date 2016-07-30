'use strict';

const Component = require('../');
const AccountModel = require('../../model/AccountModel');
const assert = require('assert');

class Base extends Component {

  * updateName(name, transaction) {
    yield this._checkSafe();
    assert(name, 'name is requried!');
    yield this._model.findByIdAndUpdate(this._id, { $set: { name } });
  }

}

Base.model = AccountModel;

Base.type = 'Account';

module.exports = Base;

//Regist the base component of account type;
const componentRegistry = global.ComponentRegistry.regist(Base, { description: 'The base component that all account components extends' });
//Regist the operations
componentRegistry.registOperation({ name: 'updateName', args: 'name:String', safe: true, description: 'Update the name' });
