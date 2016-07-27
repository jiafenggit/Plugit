'use strict';

const conn = require('../db');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let schema = new Schema({
  state: { type: String, enums: ['init', 'pendding', 'applied', 'committed', 'rollback', 'cancelled', 'reverted'], default: 'init', required: true, index: true },
  actions: [{
    component: { type: String, required: true },
    instance: { type: ObjectId, required: true },
    operation: { type: String, required: true },
    prev: {},
    state: { type: String, enums: ['init', 'applied', 'committed', 'cancelled', 'reverted'], default: 'init' }
  }],
  lastModifiedAt: { type: Date, required: true }
});

module.exports = conn.model('transaction', schema);