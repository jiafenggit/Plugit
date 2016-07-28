'use strict';

const PluginRegistryModel = require('../plugitModel/PluginRegistryModel');
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

}

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
    const pluginRegistryInfo = yield pluginRegistry.info();
    if (!pluginRegistryInfo) {
      yield pluginRegistry._create({ description, tags });
    } else if (pluginRegistryInfo.description !== description || pluginRegistryInfo.tags.join('|') !== tags.join('|')) {
      yield pluginRegistry._updatePluginDescriptionAndTags({ description, tags });
    }
    console.log(`Regist plugin [${name}] success!`);
  }).catch(e => console.error(`Regist plugin [${name}] error! Error message: ${e.message}`));
  return pluginRegistry;
};

module.exports = PluginRegistry;
global.PluginRegistry = PluginRegistry;