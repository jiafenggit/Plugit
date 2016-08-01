'use strict';

const pluginMap = global.PluginMap.design({ group: 'Tools', receptacle: 'http logger', description: 'Trigger when a http request finished' });

module.exports = function (options) {
  return function* (next) {
    this.startAt = Date.now();
    yield next;
    this.finishAt = Date.now();
    //Trigger a plugin receptacle by touch a message to notificationCenter with designed pluginMap 
    //First param is designed pluginMap, second param is the props will assign to the `this` of plugin instance, others are params will pass to plugin's `touch` method;
    //global.notificationCenter.touch(pluginMap, props, ...params);
    global.notificationCenter.touch(pluginMap, this);
  };
};
