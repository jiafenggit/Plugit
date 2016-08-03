'use strict';

//Require extension util to extend internal type prototype methods;
require('./plugit/utils/extension');

module.exports = require('./plugit/core/Plugit');

module.exports.middleware = {
  attachComponent: require('./plugit/middleware/attachComponent')
};

module.exports.Component = require('./plugit/base/Component');
module.exports.Plugin = require('./plugit/base/Plugin');
module.exports.Workflow = require('./plugit/base/Workflow');