const EventEmitter = require('events');
const PluginMap = require('./PluginMap');
const co = require('co');

class PluginEmitter extends EventEmitter {

  control(handler) {
    return this.on('touch', handler);
  }

  touch(pluginMap, props, ...params) {
    return this.emit('touch', pluginMap, props, ...params);
  }

}

global.notificationCenter = new PluginEmitter();

global.notificationCenter.control(co.wrap(function* (pluginMap, props, ...params) {
  const {plugins} = yield pluginMap.info();
  plugins.forEach(plugin => {
    try {
      new global.plugins[plugin.name](plugin.settings, props).touch(...params);
    } catch (e) {
      console.error(`Plugin [${plugin.name}] throw an error! Error message: ${e.message}`);
    }
  });
}));