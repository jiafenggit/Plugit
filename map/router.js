'use strict';

let router = require('koa-router')();
const ComponentMap = require('./ComponentMap');
const ComponentRegistry = require('./ComponentRegistry');
const assert = require('assert');
const dirWalker = require('../util/dirWalker');
const path = require('path');

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

//Pre regist all the components;
dirWalker(path.join(__dirname, '..', 'component'), filePath => require(filePath));
//Re regist all the components. Also clean all the components registed;
router.put('/registry/components', function* () {
  yield ComponentRegistry.clean();
  dirWalker(path.join(__dirname, '..', 'component'), filePath => {
    delete require.cache[filePath];
    require(filePath);
  });
  this.body = null;
});

module.exports = router.routes();