'use strict';

const Schema = require('mongoose').Schema;

//Plugin has no type
const schema = new Schema({
  group: { type: String, required: [true, 'group is requried!'], index: true },
  receptacle: { type: String, required: [true, 'plugin receptacle is requried!'], index: true, unique: true },
  description: String,
  plugins: [{
    plugin: { type: Schema.ObjectId, required: [true, 'plugin ref is required!'], ref: 'plugin_registry' },
    name: { type: String, required: [true, 'plugin name is required!'] },
    settings: {},
    pluggedAt: Date
  }]
});

schema.virtual('pluginMount').get(_ => {
  return this.plugins.length;
});

schema.index({ receptacle: 1, group: 1 }, { unique: true });

module.exports = schema;