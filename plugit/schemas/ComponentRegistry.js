'use strict';

const Schema = require('mongoose').Schema;

const schema = new Schema({
  type: { type: String, required: [true, 'component type is required!'], index: true },
  name: { type: String, required: [true, 'component name is required!'], index: true },
  description: String,
  operations: [{
    name: { type: String, required: [true, 'component operation name is requried!'] },
    args: String,
    safe: { type: Boolean, required: [true, 'component safe concern is required!'], default: false },
    description: String
  }],
  attributes: [{
    name: { type: String, requried: [true, 'component attribute name is required!'] },
    type: { type: String, required: [true, 'component attribute type is required!'], default: 'Any' },
    description: String
  }],
  settings: [{
    key: { type: String, required: [true, 'setting key is requried!'] },
    dft: { type: String, required: [true, 'setting default value is required!'] },
    regExp: { type: String, default: '^[\\s\\S]*$', required: [true, 'setting regExp is required!'] },
    description: String
  }]
});

schema.index({ type: 1, name: 1 }, { unique: true });

module.exports = schema;