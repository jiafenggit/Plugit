'use strict';

const PlugitError = require('../utils/PlugitError');
const mongoose = require('mongoose');

class PluginMap {
  constructor(group, receptacle, model = {}, pluginRegistries = {}) {
    if (typeof group !== 'string' || !group) throw new PlugitError('group should be a string');
    if (typeof receptacle !== 'string' || !receptacle) throw new PlugitError('ComponentReceptacleDesignDesk.js should be a string');
    this._group = group;
    this._receptacle = receptacle;
    this._model = model;
    this._pluginRegistries = pluginRegistries;
  }

  get group() {
    return this._group;
  }

  get receptacle() {
    return this._receptacle;
  }

  get model() {
    return this._model;
  }

  get pluginRegistries() {
    return this._pluginRegistries;
  }

  * info() {
    return yield this.model.findOne({ receptacle: this.receptacle, group: this.group });
  }

  * create({description} = {}) {
    if (yield this.info()) return;
    yield this.model({ receptacle: this.receptacle, group: this.group, description }).save();
    // Default plugged super plugin;
    yield this.pushPlugin('Plugin');
  }

  * updateDescription(description) {
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, group: this.group }, { $set: { description } });
  }

  * pushPlugin(name) {
    const plugin = yield this.model.findOne({ receptacle: this.receptacle, group: this.group, 'plugins.name': name });
    if (plugin) throw new PlugitError(`Plugin ${name} has been plugged`);
    const pluginRegistry = this.pluginRegistries[name];
    const pluginRegistryInfo = yield pluginRegistry.info();
    if (!pluginRegistryInfo) throw new PlugitError(`Plugin [${name}] is not registed!`);
    let settings = {};
    pluginRegistryInfo.settings.forEach(setting => {
      settings[setting.key] = setting.dft;
    });
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, group: this.group }, { $push: { plugins: { plugin: pluginRegistryInfo._id, name, settings, pluggedAt: new Date() } } });
  }

  * updatePluginSettingValue(name, key, value) {
    if (typeof name !== 'string' || !key) throw new PlugitError('name should be a string');
    if (typeof key !== 'string' || !key) throw new PlugitError('key should be a string');
    const plugin = yield this.model.findOne({ receptacle: this.receptacle, group: this.group, 'plugins.name': name });
    if (!plugin) throw new PlugitError(`Plugin ${name} is not plugged!`);
    const pluginRegistry = this.pluginRegistries[name];
    const pluginRegistryInfo = yield pluginRegistry.info();
    if (!pluginRegistryInfo) throw new PlugitError(`Plugin [${name}] is not registed!`);
    let regExp;
    pluginRegistryInfo.settings.forEach(setting => {
      if (setting.key == key) {
        regExp = new RegExp(setting.regExp);
        return false;
      }
    });
    if(!regExp) throw new PlugitError(`Setting [${key}] of plugin [${this._group}/${this._receptacle}] is not registed!`);
    if(!regExp.test(value)) throw new PlugitError(`Setting value ${value} do not match RegExp ${regExp}`);
    const data = {};
    data[`plugins.$.settings.${key}`] = value;
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, group: this.group, 'plugins.name': name }, { $set: data });
  }

  * pullPlugin(name) {
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, group: this.group }, { $pull: { plugins: { name } } });
  }
}

module.exports = PluginMap;