'use strict';

const assert = require('assert');

//Super plugin just for test case and extends;
class Plugin {

  constructor(settings = {}, props = {}) {
    this._props = props;
    this._settings = settings;
  }  

  get settings() {
    return this._settings;
  }

  get props() {
    return this._props;
  }

  touch(...params) {
    console.log(`[${this.settings.title}] You have triggered plugin [${Plugin.name}] with params [${params}]`);
  }
}

module.exports = Plugin;

//Regist the super Plugin;
const pluginRegistry = global.PluginRegistry.regist(Plugin, { description: 'The super plugin that all plugins extends.', tags: ['super', 'base'] });
//Regist the setting title with default regExp;
pluginRegistry.registSetting({key: 'title', dft: 'Default title', description: 'Test setting for super plugin, any string is acceptable'});