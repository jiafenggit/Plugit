'use strict';

const TransactionModel = require('../plugitModel/TransactionModel');
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const assert = require('assert');

class Transaction {

  constructor(id) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  * info() {
    return yield TransactionModel.findById(this._id);
  }

  * _create() {
    if (!(yield this.info())) {
      this._id = (yield TransactionModel().save()).id;
    }
    return this;
  }

  * pend() {
    const {state} = yield this.info();
    assert(state == 'init', 'Transaction state is not init');
    yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'pendding' } });
  }

  * pushAction({component, operation}, ...params) {
    assert(operation, 'Action should have an operation!');
    //Check the transaction state;
    const {state} = yield this.info();
    assert(state == 'pendding', 'Transaction state is not pendding');
    //Check operation registry;
    assert(component[operation], `Operation [${operation}] of component [${component.name}] has not registed!`);
    //Bind transaction to component and generate an Action;
    yield component._bindTransaction(this._id);
    const actionId = new ObjectId();
    yield TransactionModel.findByIdAndUpdate(this._id, {
      $push: {
        actions: {
          _id: actionId,
          component: component.name,
          instance: component.id,
          operation,
          prev:  yield component.info()
        }
      }
    });
    //Execute the action.
    const componentInfo = yield component.info();
    assert(!componentInfo || componentInfo.transaction == this._id, 'The transaction has no access to instance');
    yield TransactionModel.findOneAndUpdate({ _id: this._id, 'actions._id': actionId }, { $set: { 'actions.$.state': 'applied' } });
    yield component[operation](...params);
  }

  * _apply() {
    const {state, actions} = yield this.info();
    assert(state == 'pendding', 'Transaction state is not pendding');
    assert(actions.every(action => action.state == 'applied'), 'Some actions has not applied');
    yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'applied' } });
    yield this._commitAllActions();
  }

  * _commitAllActions() {
    const {state, actions} = yield this.info();
    assert(state == 'applied', 'Transaction state is not applied');
    for (let action of actions) {
      yield TransactionModel.findOneAndUpdate({ _id: this._id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'committed' } });
    }
  }

  * commit() {
    if ((yield this.info()).state == 'pendding') {
      yield this._apply();
    }
    const {actions, state} = yield this.info();
    assert(state == 'applied', 'Transaction state is not applied');
    assert(actions.every(action => action.state == 'committed'), 'Some actions has not committed');
    yield this._unbindAllInstances();
    yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'committed' } });
  }

  * _cancelAllActions() {
    const {actions, state} = yield this.info();
    assert(state == 'rollback', 'Transaction state is not rollback');
    for (let action of actions.reverse()) {
      if (['applied', 'committed'].includes(action.state)) {
        const Component = global.components[action.component];
        assert(Component, `Component ${action.component} is not defined!`);
        const component = new Component();
        component.id = action.instance;
        const componentInfo = yield component.info();
        assert(!componentInfo || componentInfo.transaction == this._id, 'The transaction has no access to instance');
        const model = component.model;
        if (action.prev) {
          yield model.findByIdAndUpdate(component.id, action.prev, { upsert: true, overwrite: true });
        } else {
          yield model.findByIdAndRemove(component.id);
        }
      }
      yield TransactionModel.findOneAndUpdate({ _id: this._id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'cancelled' } });
    }
  }

  * _unbindAllInstances() {
    const {actions, state} = yield this.info();
    assert(['applied', 'rollback'].includes(state), 'Transaction state is not rollback or applied');
    for (let action of actions) {
      const Component = global.components[action.component];
      assert(Component, `Component [${action.component}] is not defined!`);
      const component = new Component();
      component.id = action.instance;
      const componentInfo = yield component.info();
      if (!componentInfo || componentInfo.transaction == this._id) {
        yield component._unbindTransaction(this._id);
      }
    }
  }

  * _rollback() {
    const {state} = yield this.info();
    switch (state) {
      case 'init':
        yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'rollback' } });
        break;
      case 'pendding':
        yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'rollback' } });
        yield this._cancelAllActions();
        break;
      case 'rollback':
        yield this._cancelAllActions();
        break;
      case 'applied':
        throw new Error('Transaction should commit');
      case 'committed':
        throw new Error('Transaction has committed');
    }
  }

  * cancel() {
    yield this._rollback();
    const {actions, state} = yield this.info();
    assert(state == 'rollback', 'Transaction state is not rollback');
    assert(actions.every(action => action.state == 'cancelled'), 'Some actions has not cancelled');
    yield this._unbindAllInstances();
    yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'cancelled' } });
  }

  // It's an unsafe operation!!! Some versions of data will lost! 
  * revert() {
    const {actions, state} = yield this.info();
    assert(state == 'committed', 'Transaction state is not committed');
    for (let action of actions.reverse()) {
      const Component = global.components[action.component];
      assert(Component, `Component ${action.component} is not defined!`);
      const component = new Component();
      component.id = action.instance;
      const componentInfo = yield component.info();
      assert(!componentInfo || !componentInfo.transaction || componentInfo.transaction == this._id, 'The transaction has no access to instance');
      const model = component.model;
      if (action.prev) {
        yield model.findByIdAndUpdate(component.id, action.prev, { upsert: true, overwrite: true });
      } else {
        yield model.findByIdAndRemove(component.id);
      }
      yield TransactionModel.findOneAndUpdate({ _id: this._id, 'actions._id': action._id }, { $set: { 'actions.$.state': 'reverted' } });
    }
    yield TransactionModel.findByIdAndUpdate(this._id, { $set: { state: 'reverted' } });
  }
}

Transaction.create = function* (id) {
  let t = new Transaction(id);
  yield t._create();
  return t;
};

Transaction.middleware = {
  inject: function* (next) {
    this.transaction = yield Transaction.create();
    yield this.transaction.pend();
    try {
      yield next;
    } catch (e) {
      yield this.transaction.cancel();
      throw e;
    }
    yield this.transaction.commit();
  }
};

module.exports = Transaction;