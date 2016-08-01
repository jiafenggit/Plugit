
'use strict';
const PlugitError = require('../utils/PlugitError');
const ObjectId = require('mongodb').ObjectId;
//Super component only for extends;
class Base {
  constructor(settings) {
    if (!settings) throw new PlugitError('Component need a settings object, if you are overriding the constructor of the Base component class, please pass through a settings.');
    this._settings = settings;
  }

  get model() {
    throw new PlugitError('You should override model getter of you custom component!');
  }

  get settings() {
    return this._settings;
  }

  get transaction() {
    return this._transaction;
  }

  set id(id) {
    this._id = id;
  }

  get id() {
    return this._id || new ObjectId();
  }

  * info() {
    return yield this.model.findById(this.id);
  }

  * list(query) {
    return yield this.model.find(query);
  }

  * bindTransaction(transaction) {
    this._transaction = transaction;
    const info = yield this.info();
    if (info && info.transaction) throw new PlugitError('The transaction do not have access to the instance');
    yield this.model.findByIdAndUpdate(this.id, { $set: { transaction } });
  }

  * unbindTransaction(transaction) {
    const info = yield this.info();
    if (info && info.transaction && info.transaction !== transaction) throw new PlugitError('The transaction do not have access to the instance');
    yield this.model.findByIdAndUpdate(this.id, { $unset: { transaction: "" } });
  }

  * create(data = {}) {
    yield this._checkSafe();
    data._id = this.id;
    data.transaction = this.transaction;
    yield this.model(data).save();
  }

  * remove() {
    yield this._checkSafe();
    yield this.model.findByIdAndRemove(this.id);
  }

  *removeAll() {
    yield this.model.remove();
  }

  * _checkSafe() {
    const info = yield this.info();
    if (!this.transaction || (info && info.transaction !== this.transaction)) throw new PlugitError('Maybe you are doing an unsafe action! Do not call an write action outside the binding transaction!');
  }

}

Base.type = 'Base';

module.exports = Base;

// Define the registry and hotLoader will search this then automatic call this to regist component;
module.exports.componentRegistations = [{
  Component: Base,
  description: 'The super component that all components extends',
  attributes: [
    {
      name: 'id',
      type: 'ObjectId',
      description: 'The entity id of the component instance'
    }, {
      name: 'model',
      type: 'Model',
      description: 'The model related to the component instance'
    }, {
      name: 'settings',
      type: 'Object',
      description: 'The settings related to the component instance'
    }, {
      name: 'transaction',
      type: 'ObjectId',
      description: 'The transaction bind to the component instance'
    }
  ],
  operations: [
    {
      name: 'list',
      args: 'query:Object',
      description: 'Get the entity list related to the component instance'
    },
    {
      name: 'info',
      args: '',
      description: 'Get the data of the entity related to the component instance'
    },
    {
      name: 'create',
      args: 'data:Object',
      safe: true,
      description: 'Create the entity of the instance'
    },
    {
      name: 'remove',
      args: '',
      safe: true,
      description: 'Remove the entity of the instance'
    },
    {
      name: 'removeAll',
      args: '',
      description: 'Remove all entitys of the model related to the instance! It\'s vary dangerous!!! No rollback!!!'
    },
    {
      name: 'bindTransaction',
      args: 'transaction:ObjectId',
      description: 'Bind the instance to a transaction, call safe operation must bindTransaction first'
    },
    {
      name: 'unbindTransaction',
      args: 'tranaction:ObjectId',
      description: 'Unbind the transaction'
    },
  ],
  settings: [
    {
      key: 'title',
      dft: 'Default title',
      description: 'Test setting for super component, any string is acceptable'
    }
  ]
}];
