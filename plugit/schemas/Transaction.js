'use strict';

const Schema = require('mongoose').Schema;

const schema = new Schema({
  state: { type: String, enum: ['init', 'pendding', 'applied', 'committed', 'rollback', 'cancelled', 'reverted'], default: 'init', required: true, index: true },
  actions: [{
    component: { type: String, required: true },
    instance: { type: String, required: true },
    operation: { type: String, required: true },
    history: { type: Schema.ObjectId },
    prev: {},
    state: { type: String, enum: ['init', 'applied', 'committed', 'cancelled', 'reverted'], default: 'init' }
  }]
});

module.exports = schema;