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

Event1.type = 'Account';

module.exports = Event1;

//Regist the Event1 component of account type;
const componentRegistry = global.ComponentRegistry.regist(Event1, { description: 'The component is designed for Event1' });
//Regist the operations
componentRegistry.registOperation({ name: 'updateName', args: 'name:String', safe: true, description: 'Update the name' });
