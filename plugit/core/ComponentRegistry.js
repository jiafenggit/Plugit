'use strict';

const PlugitError = require('../utils/PlugitError');
const mongoose = require('mongoose');

class ComponentRegistry {
  constructor(type, name, model = {}) {
    if (typeof type !== 'string' || !type) throw new PlugitError('type should be a string');
    if (typeof name !== 'string' || !name) throw new PlugitError('name should be a string');
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._type = type;
    this._name = name;
    this._model = model;
    this._registedOperations = [];
    this._registedAttributes = [];
    this._registedSettings = [];
  }

  get registedOperations() {
    return this._registedOperations;
  }

  get registedAttributes() {
    return this._registedAttributes;
  }

  get registedSettings() {
    return this._registedSettings;
  }

  get type() {
    return this._type;
  }

  get name() {
    return this._name;
  }

  get model() {
    return this._model;
  }

  * info() {
    return yield this.model.findOne({ type: this.type, name: this.name });
  }

  * create({description} = {}) {
    if (yield this.info()) return;
    yield this.model({ type: this.type, name: this.name, description }).save();
  }

  * updateDescription(description) {
    yield this.model.findOneAndUpdate({ type: this.type, name: this.name }, { $set: { description } });
  }

  * registOperation({name, args, safe = false, description} = {}, plugit) {
    if (typeof name !== 'string' || !name) throw new PlugitError(`Operation [${name}] of component [${this.type}/${this.name}] name should be a string`);
    if (this.registedOperations.includes(name)) throw new PlugitError(`Operation [${name}] in component [${this.type}/${this.name}] has registed`);
    this.registedOperations.push(name);
    const info = yield this.info();
    if (!info) throw new PlugitError(`Component [${this.type}/${this.name}] is not registed! Please regist it first!`);
    const operation = yield this.model.findOne({ type: this.type, name: this.name, 'operations.name': name });
    if (!operation) {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name }, { $push: { operations: { name, args, safe, description } } });
    } else {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name, 'operations.name': name }, { $set: { 'operations.$': { name, args, safe, description } } });
    }
    plugit.log(`Operation [${name}] of component [${this.type}/${this.name}] regist success!`);
  }

  * registAttribute({name, type, description} = {}, plugit) {
    if (typeof name !== 'string' || !name) throw new PlugitError(`Attribute [${name}] of component [${this.type}/${this.name}] name should be a string`);
    if (typeof type !== 'string' || !type) throw new PlugitError(`Attribute [${name}] of component [${this.type}/${this.name}] type should be a string`);
    if (this.registedAttributes.includes(name)) throw new PlugitError(`Attribute [${name}] in component [${this.type}/${this.name}] has registed`);
    this.registedAttributes.push(name);
    const attribute = yield this.model.findOne({ type: this.type, name: this.name, 'attributes.name': name });
    if (!attribute) {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name }, { $push: { attributes: { name, type, description } } });
    } else {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name, 'attributes.name': name }, { $set: { 'attributes.$': { name, type, description } } });
    }
    plugit.log(`Attribute [${name}] of component [${this.type}/${this.name}] regist success!`);
  }

  * registSetting({key, dft, regExp = '^[\\s\\S]*$', description} = {}, plugit) {
    if (typeof key !== 'string' || !key) throw new PlugitError(`Setting [${key}] of component [${this.type}/${this.name}] key should be a string`);
    if (this.registedSettings.includes(key)) throw new PlugitError(`Setting [${key}] in component [${this.type}/${this.name}] has registed`);
    this.registedSettings.push(key);
    const setting = yield this.model.findOne({ type: this.type, name: this.name, 'settings.key': key });
    if (!setting) {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name }, { $push: { settings: { key, dft, regExp, description } } });
    } else {
      yield this.model.findOneAndUpdate({ type: this.type, name: this.name, 'settings.key': key }, { $set: { 'settings.$': { key, dft, regExp, description } } });
    }
    plugit.log(`Setting [${key}] of component [${this.type}/${this.name}] regist success!`);
  }

}

module.exports = ComponentRegistry;