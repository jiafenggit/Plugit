'use strict';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  name: { type: String, required: [true, 'plugin name is required!'], index: true, unique: true },
  tags: [String],
  description: String
});

module.exports = conn.model('plugin_registry', schema);