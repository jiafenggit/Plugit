'use strict';
const PlugitError = require('../utils/PlugitError.js');
const attachComponent = require('../utils/attachComponent');

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
  } else throw error;
  return function* (next) {
    if (!this.plugit) throw new PlugitError('Please inject plugit into koa context first');
    const components = this.plugit.components;
    const map = this.plugit.componentMaps[[group, workflow, receptacle].join('/')];
    if (!map) throw new PlugitError(`This receptacle [${group}/${workflow}/${receptacle}] has no component map!`);
    const mapInfo = yield map.info();
    const component = attachComponent(components, mapInfo.componentName);
    //Bind the setting;
    component.settings = mapInfo.settings || {};
    this.component = component;
    
    yield next;
  };
};