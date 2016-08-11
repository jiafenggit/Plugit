'use strict';

const PlugitError = require('../utils/PlugitError');
const mongoose = require('mongoose');

class ComponentMap {
  constructor(group, workflow, receptacle, model = {}, componentRegistries = {}) {
    if (typeof group !== 'string' || !group) throw new PlugitError('group should be a string');
    if (typeof workflow !== 'string' || !workflow) throw new PlugitError('workflow should be a string');
    if (typeof receptacle !== 'string' || !receptacle) throw new PlugitError('ComponentReceptacleDesignDesk.js should be a string');
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._group = group;
    this._workflow = workflow;
    this._receptacle = receptacle;
    this._model = model;
    this._componentRegistries = componentRegistries;
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

  get model() {
    return this._model;
  }

  get componentRegistries() {
    return this._componentRegistries;
  }

  * info() {
    return yield this.model.findOne({ receptacle: this.receptacle, workflow: this.workflow, group: this.group });
  }

  * create({type, description} = {}) {
    if (yield this.info()) return;
    const settingsAndRef = yield this._generateComponentSettingAndRef(type);
    yield this.model(Object.assign({ name: 'Base', type, description, receptacle: this.receptacle, workflow: this.workflow, group: this.group }, settingsAndRef)).save();
  }

  * updateType(type) {
    const settingsAndRef = yield this._generateComponentSettingAndRef(type);
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, workflow: this.workflow, group: this.group }, { $set: Object.assign({ name: 'Base', type }, settingsAndRef) });
  }

  * updateDescription(description) {
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, workflow: this.workflow, group: this.group }, { $set: { description } });
  }

  * updateComponentName(name) {
    const info = yield this.info();
    if (name == info.name) throw new PlugitError(`This receptacle [${this.group}/${this.workflow}/${this.receptacle}] is relating to component [${name}] now!`);
    const settingsAndRef = yield this._generateComponentSettingAndRef(info.type, name);
    yield this.model.findOneAndUpdate({ receptacle: this.receptacle, workflow: this.workflow, group: this.group }, { $set: Object.assign({ name }, settingsAndRef) });
  }

  * _generateComponentSettingAndRef(type, name = 'Base') {
    const componentRegistry = this.componentRegistries[[type, name].join('/')];
    if (!componentRegistry) throw new PlugitError(`Component [${type}/${name}] is not registed`);
    const componentRegistryInfo = yield componentRegistry.info();
    let settings = {};
    componentRegistryInfo.settings.forEach(setting => {
      settings[setting.key] = setting.dft;
    });
    return { settings, component: componentRegistryInfo._id };
  }

  * updateComponentSettingValue(key, value) {
    if (typeof key !== 'string' || !key) throw new PlugitError('key should be a string');
    const info = yield this.info();
    const componentRegistry = this.componentRegistries[[info.type, info.name].join('/')];
    const componentRegistryInfo = yield componentRegistry.info();
    if (!componentRegistryInfo) throw new PlugitError(`Component [${info.type}/${info.name}] is not registed`);
    let regExp;
    componentRegistryInfo.settings.forEach(setting => {
      if (setting.key == key) {
        regExp = new RegExp(setting.regExp);
        return false;
      }
    });
    if (!regExp) throw new PlugitError(`Setting [${key}] of component [${info.type}/${info.name}] is not registed!`);
    if (!regExp.test(value)) throw new PlugitError(`Setting value ${value} do not match RegExp ${regExp}`);
    const data = {};
    data[`settings.${key}`] = value;
    yield this.model.findOneAndUpdate({ group: this.group, workflow: this.workflow, receptacle: this.receptacle }, { $set: data });
  }

}

module.exports = ComponentMap;