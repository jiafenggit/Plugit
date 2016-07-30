'use strict';

const router = require('koa-router')();
const ComponentMap = require('./ComponentMap');
const ComponentRegistry = require('./ComponentRegistry');
const PluginMap = require('./PluginMap');
const PluginRegistry = require('./PluginRegistry');
const assert = require('assert');
const hotLoad = require('./hotLoad');
const rbac = require('koa-rbac');

//Get all the map between components and receptacles;
router.get('/map/components', function* () {
  this.body = yield ComponentMap.list();
});

//Update the component name of receptacle by searching in ComponentRegistry;
router.put('/map/components/:group/:workflow/:receptacle/name', function* () {
  const {name} = this.req.body;
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

//Update a plugin setting
router.put('/map/plugins/:group/:receptacle/plugins/:plugin/settings/:key', function* () {
  const {receptacle, group, plugin, key} = this.params;
  const {value} = this.req.body;
  const pluginMap = new PluginMap(group, receptacle);
  const pluginMapInfo = yield pluginMap.info();
  assert(pluginMapInfo, 'Plugin map is not exists!');
  this.body = yield pluginMap.updatePluginSettingValue(plugin, key, value);
});

//Update a component setting
router.put('/map/components/:group/:workflow/:receptacle/settings/:key', function* () {
  const {receptacle, group, workflow, key} = this.params;
  const {value} = this.req.body;
  const componentMap = new ComponentMap(group, workflow, receptacle);
  const componentMapInfo = yield componentMap.info();
  assert(componentMapInfo, 'Component map is not exists!');
  this.body = yield componentMap.updateComponentSettingValue(key, value);
});

//Get all the registed components;
router.get('/registry/components', function* () {
  this.body = yield ComponentRegistry.list();
});

//Get all the registed plugins;
router.get('/registry/plugins', function* () {
  this.body = yield PluginRegistry.list();
});

//re regist all the plugins, components and receptacles;
router.put('/registry', rbac.allow(['super admin api']), function* () {
  yield ComponentMap.clean();
  yield ComponentRegistry.clean();
  yield PluginMap.clean();
  yield PluginRegistry.clean();
  yield hotLoad.reload();
  this.body = null;
});

module.exports = router.routes();