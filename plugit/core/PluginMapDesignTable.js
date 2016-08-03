'use strict';

const mongoose = require('mongoose');
const PlugitError = require('../utils/PlugitError');
const PluginMap = require('./PluginMap');

class PluginMapDesignTable {
  constructor(model = {}) {
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._model = model;
    this._pluginMaps = {};
  }

  get model() {
    return this._model;
  }

  get pluginMaps() {
    return this._pluginMaps;
  }

  * list(query) {
    return yield this.model.find(query);
  }

  * clean() {
    return this.model.remove();
  }

  * design(pluginBlueprints = [], plugit) {
    const {pluginRegistries} = plugit;
    for (let {group, receptacle, description} of pluginBlueprints) {
      const id = [group, receptacle].join('/');
      if (this.pluginMaps[id]) throw new PlugitError(`Component receptacle [${id}] has designed`);
      const pluginMap = new PluginMap(group, receptacle, this.model, pluginRegistries);
      this.pluginMaps[id] = pluginMap;
      const pluginMapInfo = yield pluginMap.info();
      if (!pluginMapInfo) {
        yield pluginMap.create({ description });
      } else if (description !== pluginMapInfo.description) {
        yield pluginMap.updateDescription({ description });
      }
      plugit.log(`Plugin receptacle [${id}] designed success!`);
    }
  }
}

module.exports = PluginMapDesignTable;