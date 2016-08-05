const PlugitError = require('../utils/PlugitError');

class Worker {
  constructor({componentMap, operation, workChecksum, idBinder = _ => null,  paramsMaper = _ => null, packager = _ => null, dispatcher = _ => null} = {}) {
    if (componentMap) {
      const error = new PlugitError('The componentMap should be either a string like \'group/workflow/receptacle\' or an object contains group & workflow & receptacle');
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
    }
    if (operation && (typeof operation !== 'string' || !operation)) throw new PlugitError('The operation should be a string');
    if (paramsMaper && typeof paramsMaper !== 'function') throw new PlugitError('The paramsMaper should be a function');
    if (dispatcher && typeof dispatcher !== 'function') throw new PlugitError('The dispatcher should be a function');
    if (packager && typeof packager !== 'function') throw new PlugitError('The packager should be a function');
    if (idBinder && typeof idBinder !== 'function') throw new PlugitError('The idBinder should be a function');

    this._componentMap = componentMap;
    this._operation = operation;
    this._paramsMaper = paramsMaper;
    this._dispatcher = dispatcher;
    this._packager = packager;
    this._workChecksum = workChecksum;
    this._idBinder = idBinder;
  }

  get componentMap() {
    return this._componentMap;
  }

  get operation() {
    return this._operation;
  }

  get paramsMaper() {
    return this._paramsMaper;
  }

  get dispatcher() {
    return this._dispatcher;
  }

  get packager() {
    return this._packager;
  }

  get workChecksum() {
    return this._workChecksum;
  }

  get idBinder() {
    return this._idBinder;
  }

}

module.exports = Worker;