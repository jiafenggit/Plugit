'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const PlugitError = require('./PlugitError.js');

module.exports = (schema) => {
  schema.add({
    transaction: { type: ObjectId }
  });

  schema.pre('save', function (next) {
    if (!['plugit_transaction', 'plugit_component_map', 'plugit_component_registry', 'plugit_plugin_map', 'plugit_plugin_registry', 'plugit_auth'].includes(this.constructor.modelName)) {
      if (!this.transaction) return next(new PlugitError('Please bind a transaction first. If you have override the create operation of the Base Component, that may be not allowed. Anyway you can bind a transaction yourself (If you know the transaction id), it also works!'));
    }
    next();
  });

};