'use strict';

// Default config could be override by user config;
const DEFAULT_CONFIG = require('./default.conf.js');
//Require extension util to extend internal type prototype methods;
require('./utils/extension');

const PlugitError = require('./utils/PlugitError.js');

//Koa is the core http server supporter;
const koa = require('koa');
const serve = require('koa-static');
//Use koa-body to parse request body
const bodyParser = require('koa-body');
//Use koa-jwt to support jwt authorization;
const jwt = require('koa-jwt');
//User koa-rbac to support role management;
const rbac = require('koa-rbac');
//Override the internal RBAC Provider to adapt jwt authorization;
const RBACProvider = require('./rbac/RBACProvider');

const path = require('path');
const co = require('co');

const hotLoad = require('./utils/hotLoad');

//Export a class for user to start a Plugit project;

class Plugit {
  constructor(options = {}) {
    //TODO: options validation;
    this._options = Object.assign(DEFAULT_CONFIG, options);
    this._components = {};
    this._componentRegistries = {};
    this._componentMaps = {};
    this._plugins = {};
    this._pluginRegistries = {};
    this._pluginMaps = {};
    this._models = {};
    this._internalModulePaths = [
      path.resolve(__dirname, 'base/Component.js'),
      // path.resolve(__dirname, 'base/Plugin.js'),
      path.resolve(__dirname, 'base/Workflow.js')
    ];
  }

  get options() {
    return this._options;
  }

  get components() {
    return this._components;
  }

  get componentMaps() {
    return this._componentMaps;
  }

  get componentRegistries() {
    return this._componentRegistries;
  }

  get plugins() {
    return this._plugins;
  }

  get pluginRegistries() {
    return this._pluginRegistries;
  }

  get pluginMaps() {
    return this._pluginMaps;
  }

  get models() {
    return this._models;
  }

  get componentRegistTable() {
    return this._componentRegistTable;
  }

  get componentReceptacleDesignTable() {
    return this._componentReceptacleDesignTable;
  }

  * _attachDatabase() {
    const Database = require('./Database');
    let databaseOptions = this.options.database;
    const internalSchemas = {
      ComponentMap: require('./schemas/ComponentMap'),
      ComponentRegistry: require('./schemas/ComponentRegistry'),
      PluginMap: require('./schemas/PluginMap'),
      PluginRegistry: require('./schemas/PluginRegistry'),
      Transaction: require('./schemas/Transaction')
    };
    Object.keys(internalSchemas).forEach(key => {
      if (databaseOptions.schemas[key] || databaseOptions.schemas[key.toUnderlineCase()]) throw new PlugitError(`Schema ${key} is internal schema!`);
      databaseOptions.schemas[key] = internalSchemas[key];
    });
    this._models = yield new Database(databaseOptions).registModels();
  }

  * _registAndDesign(modules) {
    let finalComponentRegistations = [];
    let finalBlueprints = [];
    for (let module of modules) {
      const {componentRegistations, blueprints} = module;
      // Regist components
      if (Object.getOwnPropertyNames(module).includes('componentRegistations') && componentRegistations && Array.isArray(componentRegistations)) {
        finalComponentRegistations = [...finalComponentRegistations, ...componentRegistations];
      }
      //Design receptacles
      if (Object.getOwnPropertyNames(module).includes('blueprints') && blueprints && Array.isArray(blueprints)) {
        finalBlueprints = [...finalBlueprints, ...blueprints];
      }
    }
    //Regist all components!
    yield this.componentRegistTable.regist(finalComponentRegistations);
    this._components = this.componentRegistTable.components;
    this._componentRegistries = this.componentRegistTable.componentRegistries;

    //Design all component receptacles;
    yield this.componentReceptacleDesignTable.design(finalBlueprints, this._componentRegistries);
    this._componentMaps = this.componentReceptacleDesignTable.componentMaps;

  }

  * _preLoadModules() {
    // Pre load some files and for regist and design;
    const modules = hotLoad([...this._internalModulePaths, ...(this.options.hotLoad.paths || [])]).preLoad();
    yield this._registAndDesign(modules);
  }

  * reloadModules() {
    const modules = hotLoad([...this._internalModulePaths, ...(this.options.hotLoad.paths || [])]).reload();
    yield this._registAndDesign(modules);
  }

  _setTabls() {
    const models = this.models;
    // Create a componentRegistTalbe for components regist;
    const ComponentRegistTable = require('./core/ComponentRegistTable');
    this._componentRegistTable = new ComponentRegistTable(models.ComponentRegistry);
    // Create a componentReceptacleDesignTable for component receptacles design;
    const ComponentReceptacleDesignTable = require('./core/ComponentReceptacleDesignTable');
    this._componentReceptacleDesignTable = new ComponentReceptacleDesignTable(models.ComponentMap);
  }

  // Start the Plugit server and return a co Promise;  
  start() {
    if (this._started) throw new PlugitError('Server is running! Do not start it again!');
    this._started = true;
    //Start a koa app, and automatic generate registry & design;
    return co(function* () {
      // Connect to database and regist models;
      yield this._attachDatabase();

      // set tablse;
      this._setTabls();

      // pre load all modules;      
      yield this._preLoadModules();

      // Initial the koa app;
      const app = koa();

      // Set cookie keys;  
      app.keys = this.options.keys;

      // A simple http response error handler; Maybe it can be custom decided;   TODO:  
      const errorHandler = require('./middleware/errorHandler');
      app.use(errorHandler);
      // Ignore some unnecessary handle request for assets through some middleware, such as logger;
      // const ignoreAssets = require('./middleware/ignoreAssets');
      // A simple logger middleware use Plugit Plugin;
      // const logger = require('./middleware/logger');
      // app.use(ignoreAssets(logger()));

      // A mongoose transaction module for avoiding unexpected data write operations; all business routes in Plugit must preinject a transaction middleware. 
      // const Transaction = require('./plugitUtils/transaction');

      // app.use(serve(path.join(__dirname, '..', 'client', 'build')));
      app.use(jwt({ secret: this.options.jwt.secret, passthrough: true }));
      app.use(bodyParser(this.options.bodyParser));
      app.use(rbac.middleware({
        rbac: new rbac.RBAC({
          provider: new RBACProvider(this.options.rbac.rules)
        }),
        identity: ctx => {
          if (!ctx.state.user) ctx.throw(401);
          return ctx.state.user;
        }
      }));

      // Inject Plugit instance into context;
      const plugit = this;
      app.use(function* (next) {
        this.plugit = plugit;
        yield next;
      });

      //The backend management server api router;      
      app.use(require('./utils/router'));
      //Inject a transaction for all business routes;
      //Try your actions and the transaction will rollback when your actions boom;
      // app.use(Transaction.middleware.inject);
      //The business api router;
      // app.use(this.options.router);

      //App error handler;      
      app.on('error', err => {
        if (process.env.NODE_ENV === 'development' || this.options.app.errors) {
          console.error(err.stack);
        }
      });

      return yield new Promise((resolve, reject) => {
        //Server start listening;      
        app.listen(this.options.app.port, err => {
          if (err) return reject(err);
          console.log(`Server [${this.options.name}] start! Listening on ${this.options.app.port}`);
          resolve();
        });
      });

    }.bind(this));

  }
}


module.exports = Plugit;

module.exports.middleware = {
  attachComponent: require('./middleware/attachComponent')
};

module.exports.Component = require('./base/Component');
module.exports.Plugin = require('./base/Plugin');
module.exports.Workflow = require('./base/Workflow');