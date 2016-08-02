const EventEmitter = require('events');
const PlugitError = require('../utils/PlugitError.js');
const co = require('co');

class NotificationCenter extends EventEmitter {

  constructor(plugit) {
    super();
    const {plugins, pluginMaps} = plugit;
    if (!plugins || !pluginMaps) throw new PlugitError('Please call _registAndDesign method first.');
    this._plugins = plugins;
    this._pluginMaps = pluginMaps;
    this._plugit = plugit;
    this._control();
  }

  get plugins() {
    return this._plugins;
  }

  get pluginMaps() {
    return this._pluginMaps;
  }

  get plugit() {
    return this._plugit;
  }

  _control() {
    this.on('touch', co.wrap(function* ({group, receptacle}, props, ...params) {
      const map = this.pluginMaps[[group, receptacle].join('/')];
      if (!map) return this.plugit.error(`This receptacle [${group}/${receptacle}] has no plugin map!`);
      const mapInfo = yield map.info();
      mapInfo.plugins.forEach(plugin => {
        try {
          new this.plugins[plugin.name](plugin.settings, props).touch(...params);
        } catch (e) {
          this.plugit.error(`Plugin [${plugin.name}] throw an error! Error message: ${e.message}`);
        }
      });
    }.bind(this)));
    this.plugit.log('Notification center build success!');
  }

  touch(pluginMap, props, ...params) {
    const error = new PlugitError('Plugin map should be either a string like \'group/receptacle\' or an object contains group & receptacle');
    if (!pluginMap) throw error;
    let {group, receptacle} = {};
    if (typeof pluginMap === 'string') {
      const temp = pluginMap.split('/');
      if (temp.length !== 2) throw error;
      [group, receptacle] = temp;
    } else if (typeof pluginMap === 'object') {
      group = pluginMap.group;
      receptacle = pluginMap.receptacle;
      if (!group || !receptacle) throw error;
    } else throw error;
    this.emit('touch', { group, receptacle }, props, ...params);
  }

}

module.exports = NotificationCenter;