'use strict';

const Component = require('../../../plugit').Component;
const app = require('../../../app');

class Base extends Component {

  * updateName(name, transaction) {
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