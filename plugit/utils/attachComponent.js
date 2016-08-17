/**
 * Created by miserylee on 16/8/12.
 */
const PlugitError = require('./PlugitError');
const mongoose = require('mongoose');

module.exports = (models, components, componentName) => {
  const Component = components[componentName];
  if (!Component) throw new PlugitError(`Component [${componentName}] is not defined!`);
  const component = new Component();
  // If not set modelName of component, it's a pure component without data operation.
  if(component.modelName) {
    //Bind model to component by modelName set in Component;
    if (['core/ComponentMap', 'core/ComponentRegistry', 'core/PluginMap', 'core/PluginRegistry', 'core/Transaction', 'core/Auth'].includes(component.modelName)) throw new PlugitError(`Component model [${component.modelName}] is an internal model, do not use it in custom component!`);
    if (/$history\//.test(component.modelName)) throw new PlugitError(`Component model [${component.modelName}] is an history model, do not use it in custom component!`);
    const model = models[component.modelName];
    if (!model) throw new PlugitError(`Model [${component.modelName}] has not registed! Check your custom component modelName if it is right`);
    if (!(model.base instanceof mongoose.constructor)) throw new PlugitError('model must be an instance of mongoose model');
    component.model = model;
    //Bind the history model;
    const historyKey = ['history/', component.modelName.split('/')[1], 'History'].join('');
    const historyModel = models[historyKey];
    if (historyModel && !(historyModel.base instanceof mongoose.constructor)) throw new PlugitError('model must be an instance of mongoose model');
    component.historyModel = historyModel;
  }
  return component;
};