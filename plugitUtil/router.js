'use strict';

let router = require('koa-router')();
const ComponentMap = require('./ComponentMap');
const ComponentRegistry = require('./ComponentRegistry');
const PluginMap = require('./PluginMap');
const PluginRegistry = require('./PluginRegistry');
const assert = require('assert');
const hotLoad = require('./hotLoad');

//Get all the map between components and receptacles;
router.get('/map/components', function* () {
  this.body = yield ComponentMap.list();
});

//Update the component name of receptacle by searching in ComponentRegistry;
router.put('/map/components/:group/:workflow/:receptacle/name', function* () {
  const {name} = this.req.body;
  console.log(this.params);
  const {receptacle, group, workflow} = this.params;
  const componentMap = new ComponentMap(group, workflow, receptacle);
  const componentMapInfo = yield componentMap.info();
  assert(componentMapInfo, 'Component map is not exists!');
  const componentRegistry = new ComponentRegistry(componentMapInfo.type, name);
  assert(yield componentRegistry.info(), 'Component has not registed!');
  yield componentMap.updateComponentName(name);
  this.body = yield componentMap.info();
});

//Get all the map between plugins and receptacles;
router.get('/map/plugins', function* () {
  this.body = yield PluginMap.list();
});

//Push a plugin to the receptacle by searching in PluginRegistry;
router.put('/map/plugins/:group/:receptacle/plugins', function* () {
  const {plugin} = this.req.body;
  const {receptacle, group} = this.params;
  const pluginMap = new PluginMap(group, receptacle);
  const pluginMapInfo = yield pluginMap.info();
  assert(pluginMapInfo, 'Plugin map is not exists!');
  const pluginRegistry = new PluginRegistry(plugin);
  assert(yield pluginRegistry.info(), 'Plugin has not registed!');
  yield pluginMap.pushPlugin(plugin);
  this.body = yield pluginMap.info();
});

//Pull a plugin from the receptacle;
router.delete('/map/plugins/:group/:receptacle/plugins/:plugin', function* () {
  const {receptacle, group, plugin} = this.params;
  const pluginMap = new PluginMap(group, receptacle);
  const pluginMapInfo = yield pluginMap.info();
  assert(pluginMapInfo, 'Plugin map is not exists!');
  yield pluginMap.pullPlugin(plugin);
  this.body = yield pluginMap.info();
});

//Get all the registed components;
router.get('/registry/components', function* () {
  this.body = yield ComponentRegistry.list();
});

//Get all the registed plugins;
router.get('/registry/plugins', function *() {
  this.body = yield PluginRegistry.list();
});

//re regist all the plugins, components and receptacles;
router.put('/registry', function* () {
  yield ComponentMap.clean();
  yield ComponentRegistry.clean();
  yield PluginMap.clean();
  yield PluginRegistry.clean();
  yield hotLoad.reload();
  this.body = null;
});

module.exports = router.routes();