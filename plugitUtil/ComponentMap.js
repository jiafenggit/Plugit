'use strict';

const ComponentMapModel = require('../plugitModel/ComponentMapModel');
const assert = require('assert');
const path = require('path');
const co = require('co');

class ComponentMap {
  constructor(group, workflow, receptacle) {
    this._group = group;
    this._workflow = workflow;
    this._receptacle = receptacle;
  }

  get group() {
    return this._group;
  }

  get receptacle() {
    return this._receptacle;
  }

  get workflow() {
    return this._workflow;
  }

  * info() {
    return yield ComponentMapModel.findOne({ receptacle: this._receptacle, workflow: this._workflow, group: this._group });
  }

  * _create({type, name = 'Base', description} = {}) {
    if (yield this.info()) return;
    yield ComponentMapModel({ type, name, description, receptacle: this._receptacle, workflow: this._workflow, group: this._group }).save();
  }

  * _updateTypeAndDescription({type, description} = {}) {
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle, workflow: this._workflow, group: this._group }, { $set: { type, description } });
  }

  * updateComponentName(name) {
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle, workflow: this._workflow, group: this._group }, { $set: { name } });
  }

}

ComponentMap.list = function* (query) {
  return yield ComponentMapModel.find(query);
};

ComponentMap.middleware = {
  attach: function ({group, workflow, receptacle} = {}) {
    return function* (next) {
      const map = new ComponentMap(group, workflow, receptacle);
      const mapInfo = yield map.info();
      assert(mapInfo, `This receptacle [${group}/${workflow}/${receptacle}] has no component map!`);
      this.component = mapInfo.component;
      this.Component = global.components[this.component];
      yield next;
    };
  }
};

ComponentMap.designedReceptacles = [];

ComponentMap.clean = function* () {
  ComponentMap.designedReceptacles = [];
  return yield ComponentMapModel.remove();
};

ComponentMap.design = ({group, workflow, receptacle, type, description} = {}) => {
  const id = [group, workflow, receptacle].join('/');
  assert(!ComponentMap.designedReceptacles.includes(id), `Component receptacle [${id}] has designed`);
  // Record the receptacle avoid duplicate designed;
  ComponentMap.designedReceptacles.push(id);
  const componentMap = new ComponentMap(group, workflow, receptacle);
  co(function* () {
    const componentMapInfo = yield componentMap.info();
    if (!componentMapInfo) {
      yield componentMap._create({ type, description });
    } else if (componentMapInfo.type !== type || componentMapInfo.description !== description) {
      yield componentMap._updateTypeAndDescription({type, description});
    }
    console.log(`Designed component receptacle [${id}] success!`);
  }).catch(e => console.error(`Designed component receptacle [${id}] error! Error message: ${e.message}`));
  return componentMap;
};

module.exports = ComponentMap;
global.ComponentMap = ComponentMap;