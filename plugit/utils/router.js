'use strict';
const PlugitError = require('./PlugitError');
const RBACProvider = require('../rbac/RBACProvider');
const rules = require('../rbac/plugit_rules.json');
const crypto = require('../utils/crypto');

const key = 'I love Plugit';

const router = require('koa-router')({
  prefix: '/plugit'
});
const rbac = require('koa-rbac');
const jwt = require('koa-jwt');

router.use(rbac.middleware({
  rbac: new rbac.RBAC({
    provider: new RBACProvider(rules)
  }),
  identity: ctx => {
    if (!ctx.state.user) ctx.throw(401);
    return ctx.state.user;
  }
}));

router.post('/login', function *() {
  const {username, password} = this.req.body;
  if(!username || !password) this.throw(400, 'Username and password are required!');
  const AuthModel = this.plugit.models['core/PlugitAuth'];
  const {secret, exp} = this.plugit.options.jwt;
  const auth = yield AuthModel.findOne({username: username.toLowerCase(), password: crypto.sha256(password, key)});
  if(!auth) this.throw(400, 'Username or password is wrong!');
  this.body = {jwt: jwt.sign({exp: Math.round((Date.now() + exp) / 1000), auth: auth.id, roles: auth.roles}, secret)};
});

router.get('/auth', function *() {
  const auth = this.state.user;
  if(!auth) this.throw(401);
  this.body = auth;
});

router.post('/auth/super', function *() {
  const {username, password} = this.req.body;
  if(!username || !password) this.throw(400, 'Username and password are required!');
  if(!/^[a-zA-Z][a-zA-Z0-9]{5,15}$/.test(password)) this.throw(400, 'Password should be be alphanumeric and an character first with 6-16 length');
  const {secret, exp} = this.plugit.options.jwt;
  const AuthModel = this.plugit.models['core/PlugitAuth'];
  let auth;
  if(!(yield AuthModel.findOne())) {
    //Create a super manager
    auth = yield AuthModel({
      username: username.toLowerCase(),
      password: crypto.sha256(crypto.md5(password), key),
      roles: ['plugit_super']
    }).save();
  } else this.throw(400, 'Super manager has been registed');
  this.body = {jwt: jwt.sign({exp: Math.round((Date.now() + exp) / 1000), auth: auth.id, roles: auth.roles}, secret)};
});

router.post('/auth', rbac.allow(['add manager']), function *() {
  const {username, password} = this.req.body;
  if(!username || !password) this.throw(400, 'Username and password are required!');
  if(!/^[a-zA-Z][a-zA-Z0-9]{5,15}$/.test(password)) this.throw(400, 'Password should be be alphanumeric and an character first with 6-16 length');
  const AuthModel = this.plugit.models['core/PlugitAuth'];
  if(yield AuthModel.findOne({username: username.toLowerCase()})) this.throw(400, 'The username has been registed!');
  let auth = AuthModel({
    username: username.toLowerCase(),
    password: crypto.sha256(crypto.md5(password), key),
    roles: ['plugit_manager']
  }).save().toJSON();
  delete auth.password;
  this.body = auth;
});

router.delete('/auth/:id', rbac.allow(['remove manager']), function *() {
  const {id} = this.params;
  if(!id) this.throw(400, 'Id is required!');
  const AuthModel = this.plugit.models['core/PlugitAuth'];
  yield AuthModel.findByIdAndRemove(id);
  this.body = null;
});

//Get all the map between components and receptacles;
router.get('/map/components', rbac.allow(['component management']), function* () {
  this.body = yield this.plugit.componentMapDesignTable.list();
});

router.get('/map/components/groups', rbac.allow(['component management']), function* () {
  this.body = yield this.plugit.componentMapDesignTable.listGroups();
});

router.get('/map/components/groups/:group', rbac.allow(['component management']), function* () {
  this.body = yield this.plugit.componentMapDesignTable.list({ group: this.params.group });
});

//Update the component name of receptacle by searching in ComponentRegistry;
router.put('/map/components/groups/:group/workflows/:workflow/receptacles/:receptacle/name', rbac.allow(['component management']), function* () {
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
router.get('/map/plugins', rbac.allow(['plugin management']), function* () {
  this.body = yield this.plugit.pluginMapDesignTable.list();
});

//Push a plugin to the receptacle by searching in PluginRegistry;
router.put('/map/plugins/groups/:group/receptacles/:receptacle/plugins', rbac.allow(['plugin management']), function* () {
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
router.delete('/map/plugins/groups/:group/receptacles/:receptacle/plugins/:plugin', rbac.allow(['plugin management']), function* () {
  const {receptacle, group, plugin} = this.params;
  const id = [group, receptacle].join('/');
  const pluginMap = this.plugit.pluginMaps[id];
  if (!pluginMap) throw new PlugitError('Plugin map is not exists!');
  yield pluginMap.pullPlugin(plugin);
  this.body = yield pluginMap.info();
});

//Update a plugin setting
router.put('/map/plugins/groups/:group/receptacles/:receptacle/plugins/:plugin/settings/:key', rbac.allow(['plugin management']), function* () {
  const {receptacle, group, plugin, key} = this.params;
  const {value} = this.req.body;
  const pluginMap = this.plugit.pluginMaps[[group, receptacle].join('/')];
  if (!pluginMap) throw new PlugitError('Plugin map is not exists!');
  yield pluginMap.updatePluginSettingValue(plugin, key, value);
  this.body = yield pluginMap.info();
});

//Update a component setting
router.put('/map/components/groups/:group/workflows/:workflow/receptacles/:receptacle/settings/:key', rbac.allow(['component management']), function* () {
  const {receptacle, group, workflow, key} = this.params;
  const {value} = this.req.body;
  const componentMap = this.plugit.componentMaps[[group, workflow, receptacle].join('/')];
  if (!componentMap) throw new PlugitError('Component map is not exists!');
  yield componentMap.updateComponentSettingValue(key, value);
  this.body = yield componentMap.info();
});

//Get all the registed components;
router.get('/registry/components', rbac.allow(['component management']), function* () {
  this.body = yield this.plugit.componentRegistTable.list();
});

router.get('/registry/components/types/:type', rbac.allow(['component management']), function *() {
  this.body = yield this.plugit.componentRegistTable.list({type: this.params.type});
});

router.get('/registry/components/types/:type/name/:name', rbac.allow(['component management']), function *() {
  this.body = yield this.plugit.componentRegistTable.findOne({type: this.params.type, name: this.params.name});
});

//Get all the registed plugins;
router.get('/registry/plugins', rbac.allow(['plugin management']), function* () {
  this.body = yield this.plugit.pluginRegistTable.list();
});

//Reload all plugins, components and receptacles;
router.put('/reload', rbac.allow(['reload']), function* () {
  yield this.plugit.reloadModules();
  this.body = null;
});

//re regist all the plugins, components and receptacles;
router.put('/reregist', rbac.allow(['reregist']), function* () {
  const {componentRegistTable, componentMapDesignTable, pluginRegistTable, pluginMapDesignTable} = this.plugit;
  yield componentRegistTable.clean();
  yield componentMapDesignTable.clean();
  yield pluginRegistTable.clean();
  yield pluginMapDesignTable.clean();
  yield this.plugit.reloadModules();
  this.body = null;
});

module.exports = router.routes();