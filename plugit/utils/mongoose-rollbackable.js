'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

module.exports = (schema, options) => {
  schema.add({
    transaction: { type: ObjectId }
  });
};