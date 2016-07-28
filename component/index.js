
'use strict';
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');

//Super component only for extends;
class Component {
  constructor(id, model = {}) {
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

  * _bindTransaction(transaction) {
    this._transaction = transaction;
    const info = yield this.info();
    assert(!info || !info.transaction, 'The transaction do not have access to the instance');
    yield this._model.findByIdAndUpdate(this._id, { $set: { transaction } });
  }

  * _unbindTransaction(transaction) {
    const info = yield this.info();
    assert(!info || !info.transaction || info.transaction == transaction, 'The transaction do not have access to the instance');
    yield this._model.findByIdAndUpdate(this._id, { $unset: { transaction: "" } });
  }

  * create(data = {}) {
    yield this._checkSafe();
    data._id = this._id;
    data.transaction = this._transaction;
    yield this._model(data).save();
  }

  * remove() {
    yield this._checkSafe();
    yield this._model.findByIdAndRemove(this._id);
  }

  * _checkSafe() {
    const info = yield this.info();
    assert(this._transaction && (!info || info.transaction == this._transaction), 'Maybe you are doing an unsafe action! Do not call an write action outside the binding transaction!');
  }

}

module.exports = Component;


//Regist the super component;
const componentRegistry = global.ComponentRegistry.regist(Component, { type: 'Base', description: 'The super component that all components extends' });
//Regist the attributes of component;
componentRegistry.registAttribute({ name: 'id', type: 'ObjectId', description: 'The entity id of the component instance' });
componentRegistry.registAttribute({ name: 'model', type: 'Model', description: 'The model related to the component instance' });
//Regist the operation of component;
componentRegistry.registOperation({ name: 'info', args: '', description: 'Get the data of the entity related to the component instance' });
componentRegistry.registOperation({ name: 'create', args: 'data:Object', safe: true, description: 'Create the entity of the instance' });
componentRegistry.registOperation({ name: 'remove', args: '', safe: true, description: 'Remove the entity of the instance' });

