'use strict';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Plugin has no type 
let schema = new Schema({
  group: { type: String, required: [true, 'group is requried!'], index: true },
  receptacle: { type: String, required: [true, 'plugin receptacle is requried!'], index: true, unique: true },
  description: String,
  plugins: [{
    name: { type: String, required: [true, 'plugin name is requried!'] },
    pluggedAt: Date
  }]
});

schema.virtual('pluginMount').get(_ => {
  return this.plugins.length;
});

schema.index({ receptacle: 1, group: 1 }, { unique: true });

module.exports = conn.model('plugin_map', schema);