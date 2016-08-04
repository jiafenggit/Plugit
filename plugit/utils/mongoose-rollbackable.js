'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const PlugitError = require('./PlugitError.js');

module.exports = (schema, options) => {
  schema.add({
    transaction: { type: ObjectId }
  });

  schema.pre('save', function (next) {
    if (!['transaction', 'component_map', 'component_registry', 'plugin_map', 'plugin_registry'].includes(this.constructor.modelName)) {
      if (!this.transaction) return next(new PlugitError('Please bind a transaction first. If you have override the create operation of the Base Component, that may be not allowed. Anyway you can bind a transaction yourself (If you know the transaction id), it also works!'));
    }
    next();
  });
};