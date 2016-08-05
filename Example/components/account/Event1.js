'use strict';

const Base = require('./Base');

class Event1 extends Base {

  * updateName(name) {
    yield this._checkSafe();
    if (!name) throw new Error('name is required!'); 
    return yield this.model.findByIdAndUpdate(this.id, { $set: { name: `${this.settings.昵称前缀} ${name}` } }, {new: true});
  }

}

module.exports = Event1;

module.exports.componentRegistations = [{
  Component: Event1,
  description: 'The account component for event',
  operations: [
    {
      name: 'updateName',
      args: 'name:String',
      description: 'The method to update account name.'
    }
  ],
  settings: [
    {
      key: '昵称前缀',
      dft: 'Baby',
      description: '修改昵称的时候强制在前面加上前缀~ _(:з」∠)_'
    }
  ]
}];