'use strict';

const Schema = require('mongoose').Schema;

const schema = new Schema({
  name: { type: String, required: [true, 'plugin name is required!'], index: true, unique: true },
  tags: [String],
  description: String,
  settings: [{
    key: { type: String, required: [true, 'setting key is requried!'] },
    dft: { type: String, requried: [true, 'setting default value is required!'] },
    regExp: { type: String, default: '^[\\s\\S]*$', required: [true, 'setting regExp is required!'] },
    description: String
  }]
});

module.exports = schema;