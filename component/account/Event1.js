'use strict';

const Base = require('./Base');
const assert = require('assert');

class Event1 extends Base {

  * updateName(name) {
    yield this._checkSafe();
    assert(name, 'name is requried!');
    yield this._model.findByIdAndUpdate(this._id, { $set: { name: `Baby ${name}` } });
  }

}

module.exports = Event1;

const ComponentRegistry = require('../../plugitUtil/ComponentRegistry');

//Regist the Event1 component of account type;
const componentRegistry = ComponentRegistry.regist(Event1, { type: 'Account', name: 'Event1', description: 'The component is designed for Event1' });
//Regist the operations
componentRegistry.registOperation({ name: 'updateName', args: 'name:String', safe: true, description: 'Update the name' });
