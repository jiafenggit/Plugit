'use strict';

const Schema = require('mongoose').Schema;

const schema = new Schema({
  type: { type: String, required: [true, 'component type is required!'], index: true },
  component: {type: Schema.ObjectId, required: [true, 'component ref is required!'], ref: 'component_registry'},
  settings: {},
  name: { type: String, required: [true, 'component name is required!'], index: true },
  receptacle: { type: String, required: [true, 'component receptacle is required!'], index: true },
  workflow: { type: String, required: [true, 'workflow is required!'], index: true },
  group: { type: String, required: [true, 'group is requried!'], index: true },
  description: String
});

schema.virtual('componentName').get(function () {
  return [this.type, this.name].join('/');
});

schema.index({ receptacle: 1, workflow: 1, group: 1 }, { unique: true });

module.exports = schema;