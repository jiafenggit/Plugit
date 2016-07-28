'use strict';

let router = require('koa-router')();
const ComponentMap = require('./ComponentMap');
const ComponentRegistry = require('./ComponentRegistry');
const assert = require('assert');
const preLoad = require('./preLoad');
const appConfig = require('../app.conf.js');

//Get all the map between components and receptacle;
router.get('/map/components', function* () {
  this.body = yield ComponentMap.list();
});

//Update the component name of receptacle by searching in ComponentRegistry;
router.put('/map/components/:receptacle', function* () {
  const {name} = this.req.body;
  const {receptacle} = this.params;
  const componentMap = new ComponentMap(receptacle);
  const componentMapInfo = yield componentMap.info();
  assert(componentMapInfo, 'Component map is not exists!');
  const componentRegistry = new ComponentRegistry(componentMapInfo.type, name);
  assert(yield componentRegistry.info(), 'Component has not registed!');
  yield componentMap.updateComponentName(name);
  this.body = yield componentMap.info();
});

//Get all the registed components;
router.get('/registry/components', function* () {
  this.body = yield ComponentRegistry.list();
});

//re regist all the plugins, components and receptacles;
router.put('/registry', function *() {
  global.components = [];
  yield ComponentMap.clean();
  yield ComponentRegistry.clean();
  preLoad(appConfig.preLoad);
  this.body = null;
});

module.exports = router.routes();