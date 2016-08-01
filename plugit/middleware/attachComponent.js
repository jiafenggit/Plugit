'use strict';

module.exports = (componentMap) => {
  return function* (next) {
    const map = new ComponentMap(group, workflow, receptacle);
    const mapInfo = yield map.info();
    assert(mapInfo, `This receptacle [${group}/${workflow}/${receptacle}] has no component map!`);
    let Component = global.components[mapInfo.componentName];
    assert(Component, `Component [${mapInfo.componentName}] is not defined!`);
    this.component = new Component(mapInfo.settings);
    yield next;
  };
};