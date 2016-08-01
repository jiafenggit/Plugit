'use strict';

const PluginMapModel = require('../plugitModels/PluginMapModel');
const PluginRegistry = require('./PluginRegistry');
const assert = require('assert');
const path = require('path');
const co = require('co');

class PluginMap {
  constructor(group, receptacle) {
    this._group = group;
    this._receptacle = receptacle;
  }

  get group() {
    return this._group;
  }

  get receptacle() {
    return this._receptacle;
  }

  * info() {
    return yield PluginMapModel.findOne({ receptacle: this._receptacle, group: this._group });
  }

  * _create({description} = {}) {
    if (yield this.info()) return;
    yield PluginMapModel({ receptacle: this._receptacle, group: this._group, description }).save();
    // Default plugged super plugin;
    yield this.pushPlugin('Plugin');
  }

  * _updateDescription({description} = {}) {
    yield PluginMapModel.findOneAndUpdate({ receptacle: this._receptacle, group: this._group }, { $set: { description } });
  }

  * pushPlugin(name) {
    const plugin = yield PluginMapModel.findOne({ receptacle: this._receptacle, group: this._group, 'plugins.name': name });
    assert(!plugin, `Plugin ${name} has been plugged`);
    const pluginRegistry = new PluginRegistry(name);
    const pluginRegistryInfo = yield pluginRegistry.info();
    assert(pluginRegistryInfo, `Plugin [${name}] is not registed!`);
    const id = pluginRegistryInfo._id;
    let settings = {};
    pluginRegistryInfo.settings.forEach(setting => {
      settings[setting.key] = setting.dft;
    });
    yield PluginMapModel.findOneAndUpdate({ receptacle: this._receptacle, group: this._group }, { $push: { plugins: { plugin: pluginRegistryInfo._id, name, settings, pluggedAt: new Date() } } });
  }

  * updatePluginSettingValue(name, key, value) {
    assert(name && key && value, 'Plugin name, setting key and setting value are reuiqred!');
    const plugin = yield PluginMapModel.findOne({ receptacle: this._receptacle, group: this._group, 'plugins.name': name });
    assert(plugin, `Plugin ${name} is not plugged!`);
    const pluginRegistry = new PluginRegistry(name);
    const pluginRegistryInfo = yield pluginRegistry.info();
    assert(pluginRegistryInfo, `Plugin [${name}] is not registed!`);
    let regExp;
    pluginRegistryInfo.settings.forEach(setting => {
      if (setting.key == key) {
        regExp = new RegExp(setting.regExp);
        return false;
      }
    });
    assert(regExp, `Setting [${key}] of plugin [${this._group}/${this._receptacle}] is not registed!`);
    assert(regExp.test(value), `Setting value ${value} do not match RegExp ${regExp}`);
    const data = {};
    data[`plugins.$.settings.${key}`] = value;
    yield PluginMapModel.findOneAndUpdate({ receptacle: this._receptacle, group: this._group, 'plugins.name': name }, { $set: data });
  }

  * pullPlugin(name) {
    yield PluginMapModel.findOneAndUpdate({ receptacle: this._receptacle, group: this._group }, { $pull: { plugins: { name } } });
  }
}

PluginMap.list = function* (query) {
  return yield PluginMapModel.find(query);
};

PluginMap.designedReceptacles = [];

PluginMap.clean = function* () {
  PluginMap.designedReceptacles = [];
  return yield PluginMapModel.remove();
};

PluginMap.design = ({group, receptacle, description} = {}) => {
  const id = [group, receptacle].join('/');
  assert(!PluginMap.designedReceptacles.includes(id), `Plugin receptacle [${id}] has designed`);
  // Record the receptacle avoid duplicate designed;
  PluginMap.designedReceptacles.push(id);
  const pluginMap = new PluginMap(group, receptacle);
  co(function* () {
    const pluginMapInfo = yield pluginMap.info();
    if (!pluginMapInfo) {
      yield pluginMap._create({ description });
    } else if (pluginMapInfo.description !== description) {
      yield pluginMap._updateDescription({ description });
    }
    console.log(`Designed plugin receptacle [${id}] success!`);
  }).catch(e => console.error(`Designed plugin receptacle [${id}] error! Error message: ${e.message}`));
  return pluginMap;
};

module.exports = PluginMap;
global.PluginMap = PluginMap;