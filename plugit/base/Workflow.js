'use strict';

const PlugitError = require('../utils/PlugitError');
const attachComponent = require('../middleware/attachComponent');

//Super workflow for extends;
class Workflow {

  genMiddleware(works) {
    const injectRequestParams = function* (next) {
      this.paramsStream = {};
      Object.assign(this.paramsStream, this.req.body || {}, this.query || {}, this.params || {});
      yield next;
    };
    const processes = works.map((work, index) => {
      if (index == work.length - 1 && work.constructor.name !== 'GeneratorFunction') throw new PlugitError('The last work in workflow must be a generator function, anyway attach a component at last doing no effect.');
      if (typeof work === 'string' || typeof work == 'object') {
        return attachComponent(work);
      } else if (work.constructor.name === 'GeneratorFunction') {
        return function* (next) {
          const component = this.component;
          if (index == works.length - 1) {
            this.body = yield work(component, this.transaction, this.paramsStream);
          } else {
            Object.assign(this.paramsStream, (yield work(component, this.transaction, this.paramsStream)) || {});
          }
          yield next;
        };
      } else throw new PlugitError('Work must be a component map string/object for attach component or a generator function for run actions.');
    });
    return [injectRequestParams, ...processes];
  }

  genTask(works) {
    //TODO: workflow can be called without http request;
  }

}

Workflow.type = 'Base';

module.exports = Workflow;

//Design the receptacle;
module.exports.componentBlueprints = [
  {
    group: 'Base',
    workflow: 'test',
    receptacle: 'component',
    type: 'Base',
    description: 'Test workflow'
  }
];