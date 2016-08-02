'use strict';

const Component = require('../../../plugit/base/Component');

class Base extends Component {

  get modelName() {
    return 'Account';
  }

  * updateName(name) {
    yield this._checkSafe();
    if (!name) throw new Error('name is required!'); 
    yield this.model.findByIdAndUpdate(this.id, { $set: { name } });
  }

}

Base.type = 'Account';

module.exports = Base;

module.exports.componentRegistations = [{
  Component: Base,
  description: 'The base account component',
  operations: [
    {
      name: 'updateName',
      args: 'name:String',
      description: 'The method to update account name.'
    }
  ]
}];