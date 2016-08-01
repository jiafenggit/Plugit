'use strict';

const PluginRegistryModel = require('../plugitModels/PluginRegistryModel');
const assert = require('assert');
const path = require('path');
const co = require('co');

class PluginRegistry {
  constructor(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  * info() {
    return yield PluginRegistryModel.findOne({ name: this._name });
  }

  * _create({description, tags} = {}) {
    if (yield this.info()) return;
    yield PluginRegistryModel({ name: this._name, description, tags }).save();
  }

  * _updatePluginDescriptionAndTags({description, tags} = {}) {
    yield PluginRegistryModel.findOneAndUpdate({ name: this._name }, { $set: { description, tags } });
  }

  registSetting({key, dft, regExp = '^[\\s\\S]*$', description} = {}) {
    assert(key && dft, `Setting [${key}] of plugin [${this.name}] key and default value are required!`);
    const id = [this._name, key].join('/');
    PluginRegistry.registedSettings = PluginRegistry.registedSettings || [];
    assert(!PluginRegistry.registedSettings.includes(id), `Setting [${key}] in plugin [${this._name}] has registed`);
    PluginRegistry.registedSettings.push(id);
    co(function* () {
      try {
        yield this._create();
      } catch (e) {
        //do nothing.
      }
      const setting = yield PluginRegistryModel.findOne({ name: this._name, 'settings.key': key });
      if (!setting) {
        yield PluginRegistryModel.findOneAndUpdate({ name: this._name }, { $push: { settings: { key, dft, regExp, description } } });
      } else {
        yield PluginRegistryModel.findOneAndUpdate({ name: this._name, 'settings.key': key }, { $set: { 'settings.$': { key, dft, regExp, description } } });
      }
      console.log(`Setting [${key}] of Plugin [${this._name}] regist success!`);
    }.bind(this)).catch(e => console.error(`Setting [${key}] of Plugin [${this._name}] regist error! Error message: ${e.message}`));
  }

}

PluginRegistry.registedSettings = [];

PluginRegistry.list = function* (query) {
  return yield PluginRegistryModel.find(query);
};

PluginRegistry.clean = function* () {
  global.plugins = [];
  return yield PluginRegistryModel.remove();
};

PluginRegistry.regist = (Plugin, {description, tags = []} = {}) => {
  assert(typeof Plugin === 'function', 'Plugin is required and it must be a function!');
  assert(Array.isArray(tags), 'Plugin tags is either null or an array');
  global.plugins = global.plugins || {};
  const name = Plugin.name;
  assert(!global.plugins[name], `Plugin ${name} has registed in global!`);
  //Globally regist the plugin;
  global.plugins[name] = Plugin;
  const pluginRegistry = new PluginRegistry(name);
  co(function* () {
    try {
      yield pluginRegistry._create({ description, tags });
    } catch (e) {
      // do nothing.
    }
    const pluginRegistryInfo = yield pluginRegistry.info();
    if (pluginRegistryInfo.description !== description || pluginRegistryInfo.tags.join('|') !== tags.join('|')) {
      yield pluginRegistry._updatePluginDescriptionAndTags({ description, tags });
    }
    console.log(`Regist plugin [${name}] success!`);
  }).catch(e => console.error(`Regist plugin [${name}] error! Error message: ${e.message}`));
  return pluginRegistry;
};

module.exports = PluginRegistry;
global.PluginRegistry = PluginRegistry;