'use strict';
const PlugitError = require('../utils/PlugitError.js');
const mongoose = require('mongoose');

module.exports = (componentMap) => {
  const error = new PlugitError('Component map should be either a string like \'group/workflow/receptacle\' or an object contains group & workflow & receptacle');
  if (!componentMap) throw error;
  let {group, workflow, receptacle} = {};
  if (typeof componentMap === 'string') {
    const temp = componentMap.split('/');
    if (temp.length !== 3) throw error;
    [group, workflow, receptacle] = temp;
  } else if (typeof componentMap === 'object') {
    group = componentMap.group;
    workflow = componentMap.workflow;
    receptacle = componentMap.receptacle;
    if (!group || !workflow || !receptacle) throw error;
  } else throw new error;
  return function* (next) {
    if (!this.plugit) throw new PlugitError('Please inject plugit into koa context first');
    const components = this.plugit.components;
    const map = this.plugit.componentMaps[[group, workflow, receptacle].join('/')];
    if (!map) throw new PlugitError(`This receptacle [${group}/${workflow}/${receptacle}] has no component map!`);
    const mapInfo = yield map.info();
    const Component = components[mapInfo.componentName];
    if (!Component) throw new PlugitError(`Component [${mapInfo.componentName}] is not defined!`);
    const component = new Component(mapInfo.settings || {});
    //Bind model to component by modelName set in Component;
    if (['core/ComponentMap', 'core/ComponentRegistry', 'core/PluginMap', 'core/PluginRegistry', 'core/Transaction'].includes(component.modelName)) throw new PlugitError(`Component model [${component.modelName}] is an iternal model, do not use it in custom component!`);
    const model = this.plugit.models[component.modelName];
    if (!model) throw new PlugitError(`Model [${component.modelName}] has not registed! Check your custom component modelName if it is right`);
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model must be an instance of mongoose model');
    component.model = model;
    this.component = component;
    yield next;
  };
};