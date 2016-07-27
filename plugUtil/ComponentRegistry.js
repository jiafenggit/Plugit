'use strict';

const ComponentRegistryModel = require('../model/ComponentRegistryModel');
const assert = require('assert');
const path = require('path');
const co = require('co');

class ComponentRegistry {
  constructor(type, name) {
    this._type = type;
    this._name = name;
  }

  get type() {
    return this._type;
  }

  get name() {
    return this._name;
  }

  * info() {
    return yield ComponentRegistryModel.findOne({ type: this._type, name: this._name });
  }

  * _create() {
    if (yield this.info()) return;
    yield ComponentRegistryModel({ type: this._type, name: this._name }).save();
  }

  * _updateComponentDescription(description) {
    try {
      yield this._create();
    } catch (e) {
      //do nothing.
    }
    yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name }, { $set: { description } });
  }

  registOperation({name, args, description} = {}) {
    co(function* () {
      try {
        yield this._create();
      } catch (e) {
        //do nothing.
      }
      const operation = yield ComponentRegistryModel.findOne({ type: this._type, name: this._name, 'operations.name': name });
      if (!operation) {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name }, { $push: { operations: { name, args, description } } });
      } else {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name, 'operations.name': name }, { $set: { 'operations.$': { name, args, description } } });
      }
      console.log(`Regist operation ${name} of ${this._type} component named ${this._name} success!`);
    }.bind(this)).catch(e => console.error(`Regist operation ${name} of ${this._type} component named ${this._name} error! Error message: ${e.message}`));
  }

  registAttribute({name, type, description} = {}) {
    co(function* () {
      try {
        yield this._create();
      } catch (e) {
        //do nothing.
      }
      const attribute = yield ComponentRegistryModel.findOne({ type: this._type, name: this._name, 'attributes.name': name });
      if (!attribute) {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name }, { $push: { attributes: { name, type, description } } });
      } else {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name, 'attributes.name': name }, { $set: { 'attributes.$': { name, type, description } } });
      }
      console.log(`Regist attribute ${name} of ${this._type} component named ${this._name} success!`);
    }.bind(this)).catch(e => console.error(`Regist attribute ${name} of ${this._type} component named ${this._name} error! Error message: ${e.message}`));
  }

}

ComponentRegistry.list = function* (query) {
  return yield ComponentRegistryModel.find(query);
};

ComponentRegistry.clean = function* () {
  return yield ComponentRegistryModel.remove();
};

ComponentRegistry.regist = ({type, name, description} = {}) => {
  const componentRegistry = new ComponentRegistry(type, name);
  co(function* () {
    try {
      yield componentRegistry._create();
    } catch (e) {
      //do nothing.
    }
    const componentRegistryInfo = yield componentRegistry.info();
    if (componentRegistryInfo.description !== description) {
      yield componentRegistry._updateComponentDescription(description);
    }
    console.log(`Regist ${type} component named ${name} success!`);
  }).catch(e => console.error(`Regist ${type} component named ${name} error! Error message: ${e.message}`));
  return componentRegistry;
};

module.exports = ComponentRegistry;