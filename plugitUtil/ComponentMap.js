'use strict';

const ComponentMapModel = require('../plugitModel/ComponentMapModel');
const ComponentRegistry = require('./ComponentRegistry');
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

  * _create({type, description} = {}) {
    if (yield this.info()) return;
    const settingsAndRef = yield this._generateComponentSettingAndRef(type);
    yield ComponentMapModel(Object.assign({ name: 'Base', type, description, receptacle: this._receptacle, workflow: this._workflow, group: this._group }, settingsAndRef)).save();
  }

  * _updateTypeAndDescription({type, description} = {}) {
    const settingsAndRef = yield this._generateComponentSettingAndRef(type);
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle, workflow: this._workflow, group: this._group }, { $set: Object.assign({ name: 'Base', type, description }, settingsAndRef) });
  }

  * updateComponentName(name) {
    const info = yield this.info();
    assert(name != info.name, `This receptacle [${this.group}/${this.workflow}/${this.receptacle}] is relating to component [${name}] now!`);
    const settingsAndRef = yield this._generateComponentSettingAndRef(info.type, name);
    yield ComponentMapModel.findOneAndUpdate({ receptacle: this._receptacle, workflow: this._workflow, group: this._group }, { $set: Object.assign({ name }, settingsAndRef) });
  }

  * _generateComponentSettingAndRef(type, name = 'Base') {
    const componentRegistry = new ComponentRegistry(type, name);
    const componentRegistryInfo = yield componentRegistry.info();
    assert(componentRegistryInfo, `Component [${type}/${name}] is not registed`);
    let settings = {};
    componentRegistryInfo.settings.forEach(setting => {
      settings[setting.key] = setting.dft;
    });
    return { settings, component: componentRegistryInfo._id };
  }

  * updateComponentSettingValue(key, value) {
    assert(key && value, 'Setting key and value are required!');
    const info = yield this.info();
    const componentRegistry = new ComponentRegistry(info.type, info.name);
    const componentRegistryInfo = yield componentRegistry.info();
    assert(componentRegistryInfo, `Component [${info.type}/${info.name}] is not registed`);
    let regExp;
    componentRegistryInfo.settings.forEach(setting => {
      if (setting.key == key) {
        regExp = new RegExp(setting.regExp);
        return false;
      }
    });
    assert(regExp, `Setting [${key}] of component [${info.type}/${info.name}] is not registed!`);
    assert(regExp.test(value), `Setting value ${value} do not match RegExp ${regExp}`);
    const data = {};
    data[`settings.${key}`] = value;
    yield ComponentMapModel.findOneAndUpdate({ group: this.group, workflow: this.workflow, receptacle: this.receptacle }, { $set: data });
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
      let Component = global.components[mapInfo.componentName];
      assert(Component, `Component [${mapInfo.componentName}] is not defined!`);
      this.component = new Component(mapInfo.settings);
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
      yield componentMap._updateTypeAndDescription({ type, description });
    }
    console.log(`Designed component receptacle [${id}] success!`);
  }).catch(e => {
    console.error(`Designed component receptacle [${id}] error! Error message: ${e.message}`);
    console.error(e.errors);
  });
  return componentMap;
};

module.exports = ComponentMap;
global.ComponentMap = ComponentMap;