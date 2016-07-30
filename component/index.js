
'use strict';
const ObjectId = require('mongodb').ObjectId;
const assert = require('assert');

//Super component only for extends;
class Component {
  constructor(settings = {}) {
    this._model = this.constructor.model;
    this._settings = settings;
    this._id = new ObjectId();
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  get model() {
    return this._model;
  }

  get name() {
    return [this.constructor.type, this.constructor.name].join('/');
  }

  get settings() {
    return this._settings;
  }

  * info() {
    return yield this._model.findById(this._id);
  }

  * list(query) {
    return yield this._model.find(query);
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

Component.model = {};

Component.type = 'Base';

module.exports = Component;


//Regist the super component;
const componentRegistry = global.ComponentRegistry.regist(Component, { description: 'The super component that all components extends' });
//Regist the attributes of component;
componentRegistry.registAttribute({ name: 'id', type: 'ObjectId', description: 'The entity id of the component instance' });
componentRegistry.registAttribute({ name: 'model', type: 'Model', description: 'The model related to the component instance' });
componentRegistry.registAttribute({ name: 'settings', type: 'Object', description: 'The settings related to the component instance' });
//Regist the operations of component;
componentRegistry.registOperation({ name: 'list', args: 'query:Object', description: 'Get the entity list related to the component instance' });
componentRegistry.registOperation({ name: 'info', args: '', description: 'Get the data of the entity related to the component instance' });
componentRegistry.registOperation({ name: 'create', args: 'data:Object', safe: true, description: 'Create the entity of the instance' });
componentRegistry.registOperation({ name: 'remove', args: '', safe: true, description: 'Remove the entity of the instance' });
//Regist the settings of component;
componentRegistry.registSetting({key: 'title', dft: 'Default title', description: 'Test setting for super component, any string is acceptable'});