'use strict';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  type: { type: String, required: [true, 'component type is required!'], index: true },
  name: { type: String, required: [true, 'component name is required!'], index: true },
  description: String,
  operations: [{
    name: { type: String, required: [true, 'component operation name is requried!'] },
    args: String,
    description: String
  }],
  attributes: [{
    name: { type: String, requried: [true, 'component attribute name is required!'] },
    type: { type: String, required: [true, 'component attribute type is required!'], default: 'Any' },
    description: String
  }]
});

schema.index({ type: 1, name: 1 }, { unique: true });

module.exports = conn.model('component_registry', schema);