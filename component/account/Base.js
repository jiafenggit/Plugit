'use strict';

const Component = require('../');
const AccountModel = require('../../model/AccountModel');

class Base extends Component {

  * updateName(name, transaction) {
    yield this._checkSafe();
    console.log(this.settings);
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
//Regist the settings of component;
componentRegistry.registSetting({key: 'title', dft: 'Default title', description: 'Test setting for Account/Base component, any string is acceptable'});