'use strict';
const mongoose = require('mongoose');
const PlugitError = require('../utils/PlugitError');
const PluginRegistry = require('./PluginRegistry');

class PluginRegistTable {
  constructor(model = {}) {
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._model = model;
    this._plugins = {};
    this._pluginRegistries = {};
  }

  get model() {
    return this._model;
  }

  get plugins() {
    return this._plugins;
  }

  get pluginRegistries() {
    return this._pluginRegistries;
  }

  * list(query) {
    return yield this.model.find(query);
  }

  * clean() {
    return yield this.model.remove();
  }

  * regist(pluginRegistations = [], plugit) {
    const BasePlugin = require('../base/Plugin');
    for (let {Plugin, tags, description, settings} of pluginRegistations) {
      if (!(new Plugin() instanceof BasePlugin)) throw new PlugitError('Plugin is required and it must extends BasePlugin');
      const name = Plugin.name;
      if (this.plugins[name]) throw new PlugitError(`Plugin [${name}] has registed!`);
      this.plugins[name] = Plugin;
      const pluginRegistry = new PluginRegistry(name, this.model);
      this.pluginRegistries[name] = pluginRegistry;
      const pluginRegistryInfo = yield pluginRegistry.info();
      if (!pluginRegistryInfo) {
        yield pluginRegistry.create({ tags, description });
      } else if (pluginRegistryInfo.description !== description) {
        yield pluginRegistry.updateDescription(description);
      } else if (pluginRegistryInfo.tags.join('|') !== tags.join('|')) {
        yield pluginRegistry.updateTags(tags);
      }
      for (let setting of settings || []) {
        yield pluginRegistry.registSetting(setting, plugit);
      }
      plugit.log(`Plugin [${name}] registed success!`);
    }
  }
}

module.exports = PluginRegistTable;