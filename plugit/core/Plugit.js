'use strict';

const PlugitError = require('../utils/PlugitError.js');

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
const RBACProvider = require('../rbac/RBACProvider');

const path = require('path');
const co = require('co');
const merge = require('merge');

const hotLoader = require('../utils/hotLoader');
const ComponentRegistTable = require('../core/ComponentRegistTable');
const ComponentMapDesignTable = require('../core/ComponentMapDesignTable');
const PluginRegistTable = require('../core/PluginRegistTable');
const PluginMapDesignTable = require('../core/PluginMapDesignTable');

//NotificationCenter for plugin trigger.
const NotificationCenter = require('../core/NotificationCenter');


global.plugitInstances = {};

//Export a class for user to start a Plugit project;
class Plugit {
  constructor(options = {}) {
    delete require.cache[require.resolve('../default.conf.js')];
    const defaultConfig = require('../default.conf.js');
    this._options = merge.recursive(defaultConfig, options);
    if (global.plugitInstances[this.options.name]) throw new PlugitError(`Plugit server name [${this.options.name}] has registed! Please use another name.`);
    global.plugitInstances[this.options.name] = this;
    console.time(this.options.name);
    this._components = {};
    this._componentRegistries = {};
    this._componentMaps = {};
    this._plugins = {};
    this._pluginRegistries = {};
    this._pluginMaps = {};
    this._models = {};
    this._internalHotLoadPaths = [
      path.resolve(__dirname, '../base/Component.js'),
      path.resolve(__dirname, '../base/Plugin.js'),
      path.resolve(__dirname, '../base/Workflow.js'),
      path.resolve(__dirname, '../middleware')
    ];
    this._internalSchemas = {
      ComponentMap: require('../schemas/ComponentMap'),
      ComponentRegistry: require('../schemas/ComponentRegistry'),
      PluginMap: require('../schemas/PluginMap'),
      PluginRegistry: require('../schemas/PluginRegistry'),
      Transaction: require('../schemas/Transaction')
    };
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

  get componentMapDesignTable() {
    return this._componentMapDesignTable;
  }

  get pluginRegistTable() {
    return this._pluginRegistTable;
  }

  get pluginMapDesignTable() {
    return this._pluginMapDesignTable;
  }

  get notificationCenter() {
    return this._notificationCenter;
  }

  * _attachDatabases() {
    const Database = require('./Database');
    let databaseOptions = this.options.databases;
    if (!databaseOptions || !databaseOptions.core) throw new PlugitError('Require a core database for internal data saving');
    const internalSchemas = this._internalSchemas;
    Object.keys(internalSchemas).forEach(key => {
      if (databaseOptions.core.schemas[key] || databaseOptions.core.schemas[key.toUnderlineCase()]) throw new PlugitError(`Schema ${key} is internal schema!`);
      databaseOptions.core.schemas[key] = internalSchemas[key];
    });
    this._models = yield new Database(this).start();
  }

  * _registAndDesign(modules) {
    const models = this.models;
    // Create a componentRegistTalbe for components regist;
    this._componentRegistTable = new ComponentRegistTable(models['core/ComponentRegistry']);
    // Create a componentMapDesignTable for component receptacles design;
    this._componentMapDesignTable = new ComponentMapDesignTable(models['core/ComponentMap']);
    // Create a pluginRegistTable for plugins regist;
    this._pluginRegistTable = new PluginRegistTable(models['core/PluginRegistry']);
    // Create a pluginMapDesignTable for plugin receptacles design;
    this._pluginMapDesignTable = new PluginMapDesignTable(models['core/PluginMap']);

    let finalComponentRegistations = [];
    let finalComponentBlueprints = [];
    let finalPluginRegistations = [];
    let finalPluginBlueprints = [];
    for (let module of modules) {
      const {componentRegistations, componentBlueprints, pluginRegistations, pluginBlueprints} = module;
      // Regist components
      if (Object.getOwnPropertyNames(module).includes('componentRegistations') && componentRegistations && Array.isArray(componentRegistations)) {
        finalComponentRegistations = [...finalComponentRegistations, ...componentRegistations];
      }
      //Design receptacles
      if (Object.getOwnPropertyNames(module).includes('componentBlueprints') && componentBlueprints && Array.isArray(componentBlueprints)) {
        finalComponentBlueprints = [...finalComponentBlueprints, ...componentBlueprints];
      }
      //Regist plugins
      if (Object.getOwnPropertyNames(module).includes('pluginRegistations') && pluginRegistations && Array.isArray(pluginRegistations)) {
        finalPluginRegistations = [...finalPluginRegistations, ...pluginRegistations];
      }
      //Design receptacles
      if (Object.getOwnPropertyNames(module).includes('pluginBlueprints') && pluginBlueprints && Array.isArray(pluginBlueprints)) {
        finalPluginBlueprints = [...finalPluginBlueprints, ...pluginBlueprints];
      }
    }

    //Regist all components!
    yield this.componentRegistTable.regist(finalComponentRegistations, this);
    this._components = this.componentRegistTable.components;
    this._componentRegistries = this.componentRegistTable.componentRegistries;

    //Design all component receptacles;
    yield this.componentMapDesignTable.design(finalComponentBlueprints, this);
    this._componentMaps = this.componentMapDesignTable.componentMaps;

    //Regist all plugins;
    yield this.pluginRegistTable.regist(finalPluginRegistations, this);
    this._plugins = this.pluginRegistTable.plugins;
    this._pluginRegistries = this.pluginRegistTable.pluginRegistries;

    //Design all plugin receptacles;
    yield this.pluginMapDesignTable.design(finalPluginBlueprints, this);
    this._pluginMaps = this.pluginMapDesignTable.pluginMaps;

  }

  * _buildNotificationCenter() {
    this._notificationCenter = new NotificationCenter(this);
  }

  * _loadModules(modules) {
    yield this._registAndDesign(modules);
    yield this._buildNotificationCenter();
  }

  * _preloadModules() {
    // Pre load some files and for regist and design;
    const modules = hotLoader([...this._internalHotLoadPaths, ...(this.options.hotLoad.paths || [])]).preload();
    yield this._loadModules(modules);
  }

  * reloadModules() {
    const modules = hotLoader([...this._internalHotLoadPaths, ...(this.options.hotLoad.paths || [])]).reload();
    yield this._loadModules(modules);
  }

  // Start the Plugit server and return a co Promise;  
  start() {
    if (this._started) throw new PlugitError('Server is running! Do not start it again!');
    this._started = true;
    //Start a koa app, and automatic generate registry & design;
    return co(function* () {
      // Connect to database and regist models;
      yield this._attachDatabases();

      // pre load all modules;      
      yield this._preloadModules();

      // Initial the koa app;
      const app = koa();

      // Set cookie keys;  
      app.keys = this.options.keys;

      // A simple http response error handler; Maybe it can be custom decided;   TODO: Make error handler plugable; 
      const errorHandler = require('../middleware/errorHandler');
      app.use(errorHandler);
      // Ignore some unnecessary handle request for assets through some middleware, such as logger;
      const ignoreAssets = require('../middleware/ignoreAssets');
      // A simple logger middleware use Plugit Plugin;
      const logger = require('../middleware/logger');
      app.use(ignoreAssets(logger()));

      if (process.env.NODE_ENV === 'development' || this.options.cors.enabled) {
        //For cors request in development;
        const cors = require('koa-cors');
        //enable cors in development or enabled it in custom options;
        app.use(cors(this.options.cors.options));
      }

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

      //Internal serve
      app.use(function* (next) {
        // let {backendServePath} = this.plugit.options.app;
        // if (!/^\//.test(backendServePath)) backendServePath = `/${backendServePath}`;
        // if (!/\/$/.test(backendServePath)) backendServePath = `${backendServePath}/`;
        // const prefixReg = new RegExp(backendServePath);
        // if (prefixReg.test(this.path)) {
        if (/^\/plugit-backend/.test(this.path)){
          // this.path = this.path.replace(prefixReg, '/');
          yield serve(path.resolve(__dirname, '../public/build')).bind(this)(next);
        } else yield next;
      });

      //The backend management server api router;      
      app.use(require('../utils/router'));

      if (this.options.serve && typeof this.options.serve === 'object') {
        app.use(serve(this.options.serve.root, this.options.serve.opts));
      }

      // A mongoose transaction module for avoiding unexpected data write operations; all business routes in Plugit must preinject a transaction middleware. 
      const Transaction = require('../core/Transaction');
      //Inject a transaction for all business routes;
      //Try your actions and the transaction will rollback when your actions boom;
      app.use(Transaction.middleware.inject);
      //The business api router;
      if (this.options.router && 'GeneratorFunction' == this.options.router.constructor.name) {
        app.use(this.options.router);
      }

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
          this.log(`Server [${this.options.name}] start with env [${process.env.NODE_ENV}]! Listening on ${this.options.app.port}.`);
          console.timeEnd(this.options.name);
          resolve();
        });
      });

    }.bind(this));

  }

  log(...params) {
    console.log(`[${new Date().format('MM-dd hh:mm:ss.S')}][${this.options.name}]`, ...params);
  }

  error(...params) {
    console.log(`[${new Date().format('MM-dd hh:mm:ss.S')}][${this.options.name}]`, ...params);
  }

}


module.exports = Plugit;
