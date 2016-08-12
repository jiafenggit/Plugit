/**
 * Created by miserylee on 16/8/11.
 */
'use strict';
const jsondiffpatch = require('jsondiffpatch').create();

const Schema = require('mongoose').Schema;

const states = ['init', 'committed', 'cancelled'];

const schema = new Schema({
  state: {type: String, default: 'init', enum: {values: states, message: 'State is wrong!'}, required: [true, 'state is required!'], index: true},
  instance: {type: String, required: [true, 'instance is required!'], index: true},
  operation: {type: String, required: [true, 'operation is required!'], index: true},
  transaction: {type: Schema.ObjectId, required: true, index: true},
  business: {},
  prev: {},
  delta: {}
});

schema.virtual('current').get(function () {
  return jsondiffpatch.patch(this.prev, this.delta);
});

schema.set('toJSON', { virtuals: true });

module.exports = schema;