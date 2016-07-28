'use strict';

const assert = require('assert');

//Super plugin just for test case and extends;
class Plugin {

  constructor(props = {}) {
    Object.assign(this, props);
  }  

  touch(...params) {
    console.log(`You have triggered plugin [${Plugin.name}] with params ${params}`);
  }
}

module.exports = Plugin;

//Regist the super Plugin;
global.PluginRegistry.regist(Plugin, {description: 'The super plugin that all plugins extends.', tags: ['super', 'base']});