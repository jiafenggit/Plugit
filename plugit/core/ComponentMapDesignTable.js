'use strict';

const mongoose = require('mongoose');
const PlugitError = require('../utils/PlugitError.js');
const ComponentMap = require('./ComponentMap');

class ComponentMapDesignTable {
  constructor(model = {}) {
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

  * design(componentBlueprints = [], plugit) {
    const {componentRegistries} = plugit;
    for (let {group, workflow, receptacle, type, description} of componentBlueprints) {
      const id = [group, workflow, receptacle].join('/');
      if (this.componentMaps[id]) throw new PlugitError(`Component receptacle [${id}] has designed`);
      const componentMap = new ComponentMap(group, workflow, receptacle, this.model, componentRegistries);
      this.componentMaps[id] = componentMap;
      const componentMapInfo = yield componentMap.info();
      if (!componentMapInfo) {
        yield componentMap.create({ type, description });
      } else {
        if (componentMapInfo.type !== type) {
          yield componentMap.updateType(type);
        }
        if (componentMapInfo.description !== description) {
          yield componentMap.updateDescription(description);
        }
      }
      plugit.log(`Component receptacle [${id}] designed success!`);
    }
  }
}

module.exports = ComponentMapDesignTable;