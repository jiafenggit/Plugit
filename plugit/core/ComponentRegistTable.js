'use strict';
const mongoose = require('mongoose');
const BaseComponent = require('../base/Component');
const PlugitError = require('../utils/PlugitError');
const ComponentRegistry = require('./ComponentRegistry');

class ComponentRegistTable {
  constructor(model) {
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model should be a mongoose model');
    this._model = model;
    this._components = {};
    this._componentRegistries = {};
  }

  get model() {
    return this._model;
  }

  get components() {
    return this._components;
  }

  get componentRegistries() {
    return this._componentRegistries;
  }

  * list(query) {
    return yield this.model.find(query);
  }

  * clean() {
    return yield this.model.remove();
  }

  * regist(componentRegistations = []) {
    for (let {Component, description, attributes, operations, settings} of componentRegistations) {
      if (!(new Component({}) instanceof BaseComponent)) throw new PlugitError('Component is required and it must extends BaseComponent');
      const type = Component.type;
      if (!type) throw new PlugitError('Component must have type');
      const name = Component.name;
      const id = [type, name].join('/');
      if (this.components[id]) throw new PlugitError(`Component [${id}] has registed! If you regist a custom component extends the base Component, please override the static attribute 'type'`);
      this.components[id] = Component;
      const componentRegistry = new ComponentRegistry(type, name, this.model);
      this.componentRegistries[id] = componentRegistry;
      const componentRegistryInfo = yield componentRegistry.info();
      if (!componentRegistryInfo) {
        yield componentRegistry.create({ description });
      } else if (componentRegistryInfo.description !== description) {
        yield componentRegistry.updateDescription({ description });
      }
      for (let attribute of attributes || []) {
        if (!Object.getOwnPropertyNames(Component.prototype).includes(attribute.name)) throw new PlugitError(`Component [${id}] do not hava attribute [${attribute.name}]`);
        yield componentRegistry.registAttribute(attribute);
      }
      for (let operation of operations || []) {
        if (!Object.getOwnPropertyNames(Component.prototype).includes(operation.name) || typeof Component.prototype[operation.name] !== 'function') throw new PlugitError(`Component [${id}] do not hava operation [${operation.name}]`);
        if (operation.safe) {
          const regExp = new RegExp(`^\\*?${operation.name}([\\s\\S]*){yieldthis._checkSafe()`);
          if (!regExp.test(Component.prototype[operation.name].toString().replace(/\s/g, ''))) throw new PlugitError(`Operation [${operation.name}] regist in component [${id}] should checkSafe first!`);
        }
        yield componentRegistry.registOperation(operation);
      }
      for (let setting of settings || []) {
        yield componentRegistry.registSetting(setting);
      }
      console.log(`Regist component [${type}/${name}] success!`);
    }
  }
}

module.exports = ComponentRegistTable;