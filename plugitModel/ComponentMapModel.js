'use strict';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  type: { type: String, required: [true, 'component type is required!'], index: true },
  name: { type: String, required: [true, 'component name is required!'], index: true, default: 'Base' },
  receptacle: { type: String, required: [true, 'component receptacle is required!'], index: true },
  workflow: { type: String, required: [true, 'workflow is required!'], index: true },
  group: { type: String, required: [true, 'group is requried!'], index: true },
  description: String
});

schema.virtual('component').get(function () {
  return [this.type, this.name].join('/');
});

schema.index({ receptacle: 1, workflow: 1, group: 1 }, { unique: true });

module.exports = conn.model('component_map', schema);