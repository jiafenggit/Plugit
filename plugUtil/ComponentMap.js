'use strict';

const ComponentMapModel = require('../model/ComponentMapModel');
const assert = require('assert');
const path = require('path');
const co = require('co');

class ComponentMap {
  constructor(receptacle) {
    this._receptacle = receptacle;
  }

  get receptacle() {
    return this._receptacle;
  }

  * info() {
    return yield ComponentMapModel.findOne({ receptacle: this._receptacle });
  }

  * _create({type, name = 'Base'} = {}) {
    yield ComponentMapModel({ type, name, receptacle: this._receptacle }).save();
  }

  * _updateComponentType(type) {
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle }, { $set: { type } });
  }

  * updateComponentName(name) {
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle }, { $set: { name } });
  }

}

ComponentMap.list = function* (query) {
  return yield ComponentMapModel.find(query);
};

ComponentMap.middleware = {
  attach: function (receptacle) {
    return function* (next) {
      const map = new ComponentMap(receptacle);
      const mapInfo = yield map.info();
      assert(mapInfo, 'This receptacle has no component map!');
      this.component = mapInfo.component;
      this.Component = require(path.join(__dirname, '..', 'component', this.component));
      yield next;
    };
  }
};

ComponentMap.clean = function* () {
  return yield ComponentMapModel.remove();
};

ComponentMap.design = ({receptacle, type} = {}) => {
  const componentMap = new ComponentMap(receptacle);
  co(function* () {
    const componentMapInfo = yield componentMap.info();
    if (!componentMapInfo) {
      yield componentMap._create({ type });
    } else if (componentMapInfo.type !== type) {
      yield componentMap._updateComponentType(type);
    }
    console.log(`Designed receptacle ${receptacle} with type ${type} success!`);
  }).catch(e => console.error(`Designed receptacle ${receptacle} with type ${type} error! Error message: ${e.message}`));
  return componentMap;
};

module.exports = ComponentMap;