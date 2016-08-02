'use strict';

module.exports = function () {
  return function* (next) {
    this.startAt = Date.now();
    yield next;
    this.finishAt = Date.now();
    //Trigger a plugin receptacle by touch a message to notificationCenter with designed pluginMap 
    //First param is designed pluginMap, second param is the props will assign to the `this` of plugin instance, others are params will pass to plugin's `touch` method;
    //notificationCenter.touch(pluginMap, props, ...params);
    const notificationCenter = this.plugit && this.plugit.notificationCenter;
    notificationCenter && this.plugit.notificationCenter.touch('Tools/http logger', this);
  };
};

//Desgin a plugin receptacle
module.exports.pluginBlueprints = [{
  group: 'Tools',
  receptacle: 'http logger',
  description: 'Trigger when a http request finished'
}];
