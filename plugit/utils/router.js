'use strict';
const PlugitError = require('./PlugitError');

const router = require('koa-router')({
  prefix: '/plugit'
});
const rbac = require('koa-rbac');

//Get all the map between components and receptacles;
router.get('/map/components', function* () {
  this.body = yield this.plugit.componentMapDesignTable.list();
});

//Update the component name of receptacle by searching in ComponentRegistry;
router.put('/map/components/:group/:workflow/:receptacle/name', function* () {
  const {name} = this.req.body;
  const {receptacle, group, workflow} = this.params;
  const componentMap = this.plugit.componentMaps[[group, workflow, receptacle].join('/')];
  if (!componentMap) throw new PlugitError('Component map is not exists!');
  const componentMapInfo = yield componentMap.info();
  const componentRegistry = this.plugit.componentRegistries[[componentMapInfo.type, name].join('/')];
  if (!componentRegistry) throw new PlugitError('Component has not registed!');
  yield componentMap.updateComponentName(name);
  this.body = yield componentMap.info();
});

//Get all the map between plugins and receptacles;
router.get('/map/plugins', function* () {
  this.body = yield this.plugit.pluginMapDesignTable.list();
});

//Push a plugin to the receptacle by searching in PluginRegistry;
router.put('/map/plugins/:group/:receptacle/plugins', function* () {
  const {plugin} = this.req.body;
  const {receptacle, group} = this.params;
  const id = [group, receptacle].join('/');
  const pluginMap = this.plugit.pluginMaps[id];
  if (!pluginMap) throw new PlugitError('Plugin map is not exists!');
  const pluginRegistry = this.plugit.pluginRegistries[plugin];
  if (!pluginRegistry) throw new PlugitError('Plugin has not registed!');
  yield pluginMap.pushPlugin(plugin);
  this.body = yield pluginMap.info();
});

//Pull a plugin from the receptacle;
router.delete('/map/plugins/:group/:receptacle/plugins/:plugin', function* () {
  const {receptacle, group, plugin} = this.params;
  const id = [group, receptacle].join('/');
  const pluginMap = this.plugit.pluginMaps[id];
  if (!pluginMap) throw new PlugitError('Plugin map is not exists!');
  yield pluginMap.pullPlugin(plugin);
  this.body = yield pluginMap.info();
});

//Update a plugin setting
router.put('/map/plugins/:group/:receptacle/plugins/:plugin/settings/:key', function* () {
  const {receptacle, group, plugin, key} = this.params;
  const {value} = this.req.body;
  const pluginMap = this.plugit.pluginMaps[[group, receptacle].join('/')];
  if (!pluginMap) throw new PlugitError('Plugin map is not exists!');
  yield pluginMap.updatePluginSettingValue(plugin, key, value);
  this.body = yield pluginMap.info();
});

//Update a component setting
router.put('/map/components/:group/:workflow/:receptacle/settings/:key', function* () {
  const {receptacle, group, workflow, key} = this.params;
  const {value} = this.req.body;
  const componentMap = this.plugit.componentMaps[[group, workflow, receptacle].join('/')];
  if (!componentMap) throw new PlugitError('Component map is not exists!');
  yield componentMap.updateComponentSettingValue(key, value);
  this.body = yield componentMap.info();
});

//Get all the registed components;
router.get('/registry/components', function* () {
  this.body = yield this.plugit.componentRegistTable.list();
});

//Get all the registed plugins;
router.get('/registry/plugins', function* () {
  this.body = yield this.plugit.pluginRegistTable.list();
});

//Reload all plugins, components and receptacles;
router.put('/reload', function *() {
  yield this.plugit.reloadModules();
  this.body = null;
});

//re regist all the plugins, components and receptacles;
router.put('/reregist', function* () {
  const {componentRegistTable, componentMapDesignTable, pluginRegistTable, pluginMapDesignTable} = this.plugit;
  yield componentRegistTable.clean();
  yield componentMapDesignTable.clean();
  yield pluginRegistTable.clean();
  yield pluginMapDesignTable.clean();
  yield this.plugit.reloadModules();
  this.body = null;
});

module.exports = router.routes();