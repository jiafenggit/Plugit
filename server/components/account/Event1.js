'use strict';

const Base = require('./Base');
const app = require('../../../app');

class Event1 extends Base {

  * updateName(name, transaction) {
    yield this._checkSafe();
    if (!name) throw new Error('name is required!'); 
    yield this.model.findByIdAndUpdate(this.id, { $set: { name: `${this.settings.title} ${name}` } });
  }

}

module.exports = Event1;