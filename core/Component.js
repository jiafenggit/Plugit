const MongooseSungorusComponent = require('mongoose-sungorus').Component;
const SungorusHistoryComponent = require('sungorus-history').Component;
const mixin = require('mixin');

mixin(MongooseSungorusComponent, SungorusHistoryComponent);

module.exports = MongooseSungorusComponent;