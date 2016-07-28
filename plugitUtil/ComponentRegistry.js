'use strict';

const ComponentRegistryModel = require('../plugitModel/ComponentRegistryModel');
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

  registOperation({name, args, safe = false, description} = {}) {
    const component = [this._type, this._name].join('/');
    global.components = global.components || {};
    global.registedOperations = global.registedOperations || {};
    global.registedOperations[component] = global.registedOperations[component] || [];
    const ins = new global.components[component]();
    assert(ins[name], 'Operation ${name} regist do not exists!');
    if (safe) {
      const regExp = new RegExp(`^\\*?${name}([\\s\\S]*){yieldthis._checkSafe()`);
      assert(regExp.test(ins[name].toString().replace(/\s/g, '')), `Operation ${name} regist in ${this.type}/${this.name} should checkSafe first!`);
    }

    co(function* () {
      try {
        yield this._create();
      } catch (e) {
        //do nothing.
      }
      const operation = yield ComponentRegistryModel.findOne({ type: this._type, name: this._name, 'operations.name': name });
      if (!operation) {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name }, { $push: { operations: { name, args, safe, description } } });
      } else {
        yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name, 'operations.name': name }, { $set: { 'operations.$': { name, args, safe, description } } });
      }
      console.log(`Operation ${name} of component ${this.type}/${this.name} regist success!`);
    }.bind(this)).catch(e => console.error(`Operation ${name} of component ${this.type}/${this.name} regist error! Error message: ${e.message}`));
    //Globally regist operation of component
    global.registedOperations[component].push(name);
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
      console.log(`Attribute ${name} of component ${this._type}/${this._name} regist success!`);
    }.bind(this)).catch(e => console.error(`Attribute ${name} of component ${this._type}/${this._name} regist error! Error message: ${e.message}`));
  }

}

ComponentRegistry.list = function* (query) {
  return yield ComponentRegistryModel.find(query);
};

ComponentRegistry.clean = function* () {
  return yield ComponentRegistryModel.remove();
};

ComponentRegistry.regist = (Component, {type, name, description} = {}) => {
  global.components = global.components || {};
  const component = [type, name].join('/');
  assert(!global.components[component], `Component ${component} has registed in global!`);
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
    console.log(`Regist component ${type}/${name} success!`);
  }).catch(e => console.error(`Regist component ${type}/${name} error! Error message: ${e.message}`));
  //Globally regist the component;
  global.components[component] = Component;
  return componentRegistry;
};

module.exports = ComponentRegistry;