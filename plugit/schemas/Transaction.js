'use strict';

const Schema = require('mongoose').Schema;

const schema = new Schema({
  state: { type: String, enums: ['init', 'pendding', 'applied', 'committed', 'rollback', 'cancelled', 'reverted'], default: 'init', required: true, index: true },
  actions: [{
    component: { type: String, required: true },
    instance: { type: Schema.ObjectId, required: true },
    operation: { type: String, required: true },
    prev: {},
    state: { type: String, enums: ['init', 'applied', 'committed', 'cancelled', 'reverted'], default: 'init' }
  }]
});

module.exports = schema;