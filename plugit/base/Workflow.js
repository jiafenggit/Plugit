'use strict';

const PlugitError = require('../utils/PlugitError');
const attachComponent = require('../middleware/attachComponent');
const Worker = require('./Worker');
const Transaction = require('../core/Transaction');

//Super workflow for extends;
class Workflow {
  middleware(name) {
    if (this[name] && Array.isArray(this[name].workers)) {
      return Workflow.genMiddleware(this[name]);
    } else throw new PlugitError(`Workflow name [${name}] is not a valid workflow`);
  }
}

Workflow.genMiddleware = ({workers, injectTransaction = true, businessForHistory} = {}) => {

  let middleware = [];

  if (injectTransaction) {
    middleware.push(function* (next) {
      if (!this.plugit) throw new PlugitError('Please inject plugit into koa context first');
      const components = this.plugit.components;
      const models = this.plugit.models;
      this.transaction = yield new Transaction(models, components).create();
      yield this.transaction.pend();
      try {
        yield next;
      } catch (e) {
        yield this.transaction.cancel();
        throw e;
      }
      yield this.transaction.commit();
    });
  }

  if (businessForHistory && typeof businessForHistory === 'function') {
    if (!this.transaction) console.warn('The workflow has not inject a transaction, the businessForHistory function will not work!');
    else {
      middleware.push(function *(next) {
        this.businessForHistory = businessForHistory(this);
        yield next;
      });
    }
  }

  // Make all request params to req of payload;
  middleware.push(function*(next) {
    if (!this.plugit) throw new PlugitError('Plugit instance is required in a workflow');
    this.payload = {req: {}, state: this.state};
    Object.assign(this.payload.req, (this.req && this.req.body) || (this.request && this.request.body) || {}, this.query || {}, this.params || {});
    this.works = [];
    yield next;
  });

  workers.forEach((worker) => {
    if (!(worker instanceof Worker)) throw new PlugitError('The worker must be a instance of Worker');

    const {componentMap, operation, idBinder, paramsMapper, packager, dispatcher, workChecksum, danger} = worker;

    // Attach to component;      
    if (componentMap) {
      middleware.push(attachComponent(componentMap));
    }

    middleware.push(function*(next) {
      // Do operation to get result;   
      let result;
      if (operation && this.component) {
        const component = this.component;
        let work = [component.constructor.type, operation].join('/');
        if (workChecksum) work = `${work}/${workChecksum}`;
        if (this.works.includes(work)) {
          this.works.splice(this.works.indexOf(work), 1);
          // Get params;
          const params = paramsMapper(this.payload) || [];
          if (!Array.isArray(params)) throw new PlugitError('The paramsMap should return an array');
          // Bind id to the component;
          const id = idBinder(this.payload);
          if (id) component.id = id;
          // Run the action!
          // If no transaction has injected, run the operation through the component directly;
          // !!! if a component has no model (as a pure component), it runs without transaction
          if (this.transaction && danger && component.modelName) {
            result = yield this.transaction.run({
              component,
              operation,
              business: this.businessForHistory
            }, ...params);
          } else {
            const Component = require('../base/Component');
            if (!(component instanceof Component)) throw new PlugitError('component must be an instance of Component or class extends Component');
            if (typeof component[operation] !== 'function') throw new PlugitError(`Operation [${operation}] of component [${component.name}] has not registed!`);
            result = yield component[operation](...params);
          }

        }
      }

      // Dispatch new works;        
      let newWorks = dispatcher(result, this.payload) || [];
      if (!Array.isArray(newWorks)) throw new PlugitError('The dispatcher should return an array');
      newWorks = newWorks.map(w => {
        const error = new PlugitError(`The work dispatched should be a 'componentType/operation[/workChecksum]' like string or an object contains componentType and operation, optional contains workChecksum`);
        let {componentType, operation, workChecksum} = {};
        if (typeof w === 'string') {
          const temp = w.split('/');
          if (temp.length !== 2 && temp.length != 3) throw error;
          [componentType, operation, workChecksum] = temp;
        } else if (typeof w === 'object') {
          componentType = w.componentType;
          operation = w.operation;
          workChecksum = w.workChecksum;
          if (!componentType || !operation) throw error;
        } else throw error;
        w = workChecksum ? [componentType, operation, workChecksum].join('/') : [componentType, operation].join('/');
        if (this.works.includes(w)) throw new PlugitError(`The work [${w}] has been in works, please change the workChecksum!`);
        return w;
      });
      this.works = [...this.works, ...newWorks];

      // Package result to payload;        
      const packages = packager(result, this.payload) || {};
      if (typeof packages !== 'object') throw new PlugitError('The packager should return an object');
      Object.keys(packages).forEach(key => {
        if (this.payload[key]) throw new PlugitError(`Package [${key}] has been in payload, please change the key to another!`);
      });
      Object.assign(this.payload, packages);
      yield next;
    });
  });

  // Check works pool and return res of payload to the client;
  middleware.push(function*(next) {
    if (this.works.length !== 0) throw new PlugitError(`Maybe you need to add more workers to handle the rest works [${this.works.toString()}]`);
    this.body = this.payload.res;
    yield next;
  });
  return middleware;
};

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