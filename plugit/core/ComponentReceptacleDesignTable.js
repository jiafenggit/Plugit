'use strict';

const mongoose = require('mongoose');
const PlugitError = require('../utils/PlugitError.js');
const ComponentMap = require('./ComponentMap');

class ComponentReceptacleDesignTable {
  constructor(model) {
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._model = model;
    this._componentMaps = {};
  }

  get model() {
    return this._model;
  }

  get componentMaps() {
    return this._componentMaps;
  }

  * list(query) {
    return yield this.model.find(query);
  }

  * clean() {
    return yield this.model.remove();
  }

  * design(blueprints = [], componentRegistries = {}) {
    for (let {group, workflow, receptacle, type, description} of blueprints) {
      const id = [group, workflow, receptacle].join('/');
      if (this.componentMaps[id]) throw new PlugitError(`Component receptacle [${id}] has designed`);
      const componentMap = new ComponentMap(group, workflow, receptacle, this.model);
      this.componentMaps[id] = componentMap;
      const componentMapInfo = yield componentMap.info();
      if (!componentMapInfo) {
        yield componentMap.create({ type, description }, componentRegistries);
      } else if (componentMapInfo.type !== type || componentMapInfo.description !== description) {
        yield componentMap.updateTypeAndDescription({ type, description }, componentRegistries);
      }
      console.log(`Designed component receptacle [${id}] success!`);
    }
  }
}

module.exports = ComponentReceptacleDesignTable;