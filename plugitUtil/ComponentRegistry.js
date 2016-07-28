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

  * _create({description} = {}) {
    if (yield this.info()) return;
    yield ComponentRegistryModel({ type: this._type, name: this._name, description }).save();
  }

  * _updateDescription({description} = {}) {
    yield ComponentRegistryModel.findOneAndUpdate({ type: this._type, name: this._name }, { $set: { description } });
  }

  registOperation({name, args, safe = false, description} = {}) {
    const component = [this._type, this._name].join('/');
    global.components = global.components || {};
    global.registedOperations = global.registedOperations || {};
    global.registedOperations[component] = global.registedOperations[component] || [];
    assert(!global.registedOperations[component].includes(name), `Operation [${name}] in [${this.type}/${this.name}] has registed`);
    //Globally regist operation of component
    global.registedOperations[component].push(name);
    const ins = new global.components[component]();
    assert(ins[name], `Operation [${name}] regist in [${this.type}/${this.name}] do not exists!`);
    if (safe) {
      const regExp = new RegExp(`^\\*?${name}([\\s\\S]*){yieldthis._checkSafe()`);
      assert(regExp.test(ins[name].toString().replace(/\s/g, '')), `Operation [${name}] regist in [${this.type}/${this.name}] should checkSafe first!`);
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
      console.log(`Operation [${name}] of component [${this.type}/${this.name}] regist success!`);
    }.bind(this)).catch(e => console.error(`Operation [${name}] of component [${this.type}/${this.name}] regist error! Error message: ${e.message}`));
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
      console.log(`Attribute [${name}] of component [${this._type}/${this._name}] regist success!`);
    }.bind(this)).catch(e => console.error(`Attribute [${name}] of component [${this._type}/${this._name}] regist error! Error message: ${e.message}`));
  }

}

ComponentRegistry.list = function* (query) {
  return yield ComponentRegistryModel.find(query);
};

ComponentRegistry.clean = function* () {
  global.components = [];
  global.registedOperations = {};
  return yield ComponentRegistryModel.remove();
};

ComponentRegistry.regist = (Component, {type, description} = {}) => {
  assert(typeof Component === 'function', 'Component is required and it must be a function!');
  global.components = global.components || {};
  const name = Component.name;
  const component = [type, name].join('/');
  assert(!global.components[component], `Component ${component} has registed in global!`);
  //Globally regist the component;
  global.components[component] = Component;
  const componentRegistry = new ComponentRegistry(type, name);
  co(function* () {
    try {
      yield componentRegistry._create({ description });
    } catch (e) {
      // do nothing.
    }
    const componentRegistryInfo = yield componentRegistry.info();
    if (componentRegistryInfo.description !== description) {
      yield componentRegistry._updateDescription({description});
    }
    console.log(`Regist component [${type}/${name}] success!`);
  }).catch(e => console.error(`Regist component [${type}/${name}] error! Error message: ${e.message}`));
  return componentRegistry;
};

module.exports = ComponentRegistry;
global.ComponentRegistry = ComponentRegistry;