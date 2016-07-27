'use strict';

const Base = require('./Base');
const assert = require('assert');
const ComponentRegistry = require('../../map/ComponentRegistry');

//Regist the Event1 component of account type;
const componentRegistry = ComponentRegistry.regist({ type: 'account', name: 'Event1', description: 'The component is designed for Event1' });
//Regist the operations
componentRegistry.registOperation({ name: '* updateName', args: 'name:String', description: 'Update the name' });

class Event1 extends Base {

  * updateName(name) {
    assert(name, 'name is requried!');
    yield this._model.findByIdAndUpdate(this._id, { $set: { name: `Baby ${name}` } });
  }

}

module.exports = Event1;