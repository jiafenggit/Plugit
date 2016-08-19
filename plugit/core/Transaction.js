'use strict';

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const PlugitError = require('../utils/PlugitError');
const attachComponent = require('../utils/attachComponent');

class Transaction {

  constructor(models = {}, components) {
    const model = models['core/PlugitTransaction'];
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model must be an instance of mongoose model');
    if (typeof components !== 'object') throw new PlugitError('components should be an object');
    this._model = model;
    this._models = models;
    this._components = components;
  }

  get id() {
    return this._id;
  }

  get model() {
    return this._model;
  }

  get models() {
    return this._models;
  }

  get components() {
    return this._components;
  }

  * info() {
    return yield this.model.findById(this.id);
  }

  * create() {
    if (!(yield this.info())) {
      this._id = (yield this.model().save()).id;
    }
    return this;
  }

  * pend() {
    const {state} = yield this.info();
    if (state !== 'init') throw new PlugitError('Transaction state is not init');
    yield this.model.findByIdAndUpdate(this._id, { $set: { state: 'pendding' } });
  }

  * run({component, operation, business = {}}, ...params) {
    const Component = require('../base/Component');
    if (!(component instanceof Component)) throw new PlugitError('component must be an instance of Component or class extends Component');
    if (typeof operation !== 'string' || !operation) throw new PlugitError('Action should have an string operation');
    //Check the transaction state;
    const {state} = yield this.info();
    if (state !== 'pendding') throw new PlugitError('Transaction state is not pendding');
    //Check operation registry;
    if (typeof component[operation] !== 'function') throw new PlugitError(`Operation [${operation}] of component [${component.name}] has not registed!`);
    //Bind transaction to component and generate an Action;
    yield component.bindTransaction(this.id);
    const actionId = new ObjectId();
    const componentInfo = yield component.info();
    const history = yield component.initHistory(this.id, operation, business);
    yield this.model.findByIdAndUpdate(this.id, {
      $push: {
        actions: {
          _id: actionId,
          component: component.name,
          instance: componentInfo ? componentInfo._id : component.id,
          operation,
          prev: componentInfo,
          history: history ? history.id : null
        }
      }
    });
    //Execute the action.
    if (componentInfo && componentInfo.transaction != this.id) throw new PlugitError('The transaction has no access to instance');
    const ret = yield component[operation](...params);
    yield this.model.findOneAndUpdate({ _id: this.id, 'actions._id': actionId }, { $set: { 'actions.$.state': 'applied' } });
    return ret;
  }

  * _apply() {
    const {state, actions} = yield this.info();
    if (state !== 'pendding') throw new PlugitError('Transaction state is not pendding');
    if (actions.some(action => action.state !== 'applied')) throw new PlugitError('Some actions has not applied');
    yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'applied' } });
    yield this._commitAllActions();
  }

  * _commitAllActions() {
    const {state, actions} = yield this.info();
    if (state !== 'applied') throw new PlugitError('Transaction state is not applied');
    for (let action of actions) {
      if(action.state === 'applied') {
        const component = yield this._attachComponent(action);
        yield this.model.findOneAndUpdate({ _id: this.id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'committed' } });
        if(action.history) yield component.commitHistory(action.history);
      }
    }
  }

  * commit() {
    if ((yield this.info()).state == 'pendding') {
      yield this._apply();
    }
    const {actions, state} = yield this.info();
    if (state !== 'applied') throw new PlugitError('Transaction state is not applied');
    if (actions.some(action => action.state !== 'committed')) throw new PlugitError('Some actions has not committed');
    yield this._unbindAllInstances();
    yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'committed' } });
  }

  * _attachComponent(action) {
    const component = attachComponent(this.models, this.components, action.component);
    component.id = action.instance;
    yield component.bindTransaction(this.id);
    return component;
  }

  * _cancelAllActions() {
    const {actions, state} = yield this.info();
    if (state !== 'rollback') throw new PlugitError('Transaction state is not rollback');
    for (let action of actions.reverse()) {
      const component = yield this._attachComponent(action);
      if (['applied', 'committed'].includes(action.state)) {
        const componentInfo = yield component.info();
        if (componentInfo && componentInfo.transaction != this.id) throw new PlugitError('The transaction has no access to instance');
        if (component.rollback) {
          yield component.rollback(action.prev);
        } else {
          const model = component.model;
          if (action.prev) {
            yield model.findByIdAndUpdate(component.id, action.prev, { upsert: true, overwrite: true });
          } else {
            yield model.findByIdAndRemove(component.id);
          }
        }
      }
      if(action.history) yield component.cancelHistory(action.history);
      yield this.model.findOneAndUpdate({ _id: this.id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'cancelled' } });
    }
  }

  * _unbindAllInstances() {
    const {actions, state} = yield this.info();
    if (!['applied', 'rollback'].includes(state)) throw new PlugitError('Transaction state is not rollback or applied');
    for (let action of actions) {
      const component = yield this._attachComponent(action);
      const componentInfo = yield component.info();
      if (!componentInfo || componentInfo.transaction == this.id) {
        yield component.unbindTransaction(this.id);
      }
    }
  }

  * _rollback() {
    const {state} = yield this.info();
    switch (state) {
      case 'init':
        yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'rollback' } });
        break;
      case 'pendding':
        yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'rollback' } });
        yield this._cancelAllActions();
        break;
      case 'rollback':
        yield this._cancelAllActions();
        break;
      case 'applied':
        throw new Error('Transaction should commit');
      case 'committed':
        throw new Error('Transaction has committed');
      case 'cancelled':
        throw new Error('Transaction has cancelled');
    }
  }

  * cancel() {
    yield this._rollback();
    const {actions, state} = yield this.info();
    if (state !== 'rollback') throw new PlugitError('Transaction state is not rollback');
    if (actions.some(action => action.state !== 'cancelled')) throw new PlugitError('Some actions has not cancelled');
    yield this._unbindAllInstances();
    yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'cancelled' } });
  }

  // It's an unsafe operation!!! Some versions of data will lost!
  * revert() {
    const {actions, state} = yield this.info();
    if (state !== 'committed') throw new PlugitError('Transaction state is not committed');
    for (let action of actions.reverse()) {
      const component = yield this._attachComponent(action);
      const componentInfo = yield component.info();
      if (componentInfo && componentInfo.transaction && componentInfo.transaction != this.id) throw new PlugitError('The transaction has no access to instance');
      const model = component.model;
      if (action.prev) {
        yield model.findByIdAndUpdate(component.id, action.prev, { upsert: true, overwrite: true });
      } else {
        yield model.findByIdAndRemove(component.id);
      }
      yield this.model.findOneAndUpdate({ _id: this.id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'reverted' } });
    }
    yield this.model.findByIdAndUpdate(this.id, { $set: { state: 'reverted' } });
  }
}

module.exports = Transaction;