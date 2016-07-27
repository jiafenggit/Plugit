
'use strict';
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');
const ComponentRegistry = require('../plugUtil/ComponentRegistry');

//Regist the super component;
const componentRegistry = ComponentRegistry.regist({ type: 'base', name: 'Base', description: 'The super component that all components extends' });
//Regist the attributes of component;
componentRegistry.registAttribute({ name: 'id', type: 'ObjectId', description: 'The entity id of the component instance' });
componentRegistry.registAttribute({ name: 'model', type: 'Model', description: 'The model related to the component instance' });
//Regist the operation of component;
componentRegistry.registOperation({ name: '* info', args: '', description: 'Get the data of the entity related to the component instance' });
componentRegistry.registOperation({ name: '* bindTransaction', args: 'transaction:ObjectId', description: 'Bind the component instance to and transaction' });
componentRegistry.registOperation({ name: '* create', args: 'data:Object', description: 'Create the entity of the instance' });
componentRegistry.registOperation({ name: '* remove', args: '', description: 'Remove the entity of the instance' });

class Component {
  constructor(id, model) {
    assert(model, 'model is required!');
    this._id = id || new ObjectId();
    this._model = model;
  }

  get id() {
    return this._id;
  }

  get model() {
    return this._model;
  }

  * info() {
    return yield this._model.findById(this._id);
  }

  * bindTransaction(transaction) {
    this._transaction = transaction;
    let ins = yield this._model.findByIdAndUpdate(this._id, { $set: { transaction } });
  }

  * unbindTransaction() {
    yield this._model.findByIdAndUpdate(this._id, { $unset: { transaction: "" } });
  }

  * create(data = {}) {
    data._id = this._id;
    data.transaction = this._transaction;
    yield this._model(data).save();
  }

  * remove() {
    yield this._model.findByIdAndRemove(this._id);
  }

}

module.exports = Component;