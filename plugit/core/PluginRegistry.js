'use strict';

const PlugitError = require('../utils/PlugitError');
const mongoose = require('mongoose');

class PluginRegistry {
  constructor(name, model = {}) {
    if (typeof name !== 'string' || !name) throw new PlugitError('name should be a string');
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._name = name;
    this._model = model;
    this._registedSettings = [];
  }

  get name() {
    return this._name;
  }

  get model() {
    return this._model;
  }

  get registedSettings() {
    return this._registedSettings;
  }

  * info() {
    return yield this.model.findOne({ name: this.name });
  }

  * create({description, tags} = {}) {
    if (yield this.info()) return;
    yield this.model({ name: this.name, description, tags }).save();
  }

  * updateDescription(description) {
    yield this.model.findOneAndUpdate({ name: this.name }, { $set: { description } });
  }

  * updateTags(tags) {
    yield this.model.findOneAndUpdate({ name: this.name }, { $set: { tags } });
  }

  * registSetting({key, dft, regExp = '^[\\s\\S]*$', description} = {}, plugit) {
    if (typeof key !== 'string' || !key) throw new PlugitError(`Setting [${key}] of plugin [${this.name}] key should be a string`);
    if (this.registedSettings.includes(key)) throw new PlugitError(`Setting [${name}] in plugin [${this.name}] has registed`);
    this.registedSettings.push(key);
    const setting = yield this.model.findOne({ name: this.name, 'settings.key': key });
    if (!setting) {
      yield this.model.findOneAndUpdate({ name: this.name }, { $push: { settings: { key, dft, regExp, description } } });
    } else {
      yield this.model.findOneAndUpdate({ name: this.name, 'settings.key': key }, { $set: { 'settings.$': { key, dft, regExp, description } } });
    }
    plugit.log(`Setting [${key}] of Plugin [${this.name}] regist success!`);
  }

}

module.exports = PluginRegistry;