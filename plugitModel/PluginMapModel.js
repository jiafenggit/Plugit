'use strict';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Plugin has no type 
let schema = new Schema({
  receptacle: { type: String, required: [true, 'plugin receptacle is requried!'], index: true, unique: true },
  plugins: [{
    name: { type: String, required: [true, 'plugin name is requried!'] },
    pluggedAt: Date
  }]
});

module.exports = conn.model('plugin_map', schema);