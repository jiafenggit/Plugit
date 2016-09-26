const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jsonDiff = require('mongoose-json-diff');
const mongooseSungorus = require('mongoose-sungorus').plugin;

const schema = new Schema({
  name: {type: String, required: [true, 'Name is required!']},
  gender: {type: String, required: [true, 'Gender is required!'], enums: {
    values: ['male', 'female'],
    message: 'Gender should be male or female'
  }}
});

schema.plugin(jsonDiff);
schema.plugin(mongooseSungorus);

const connection = require('./connection');
module.exports = connection.model('person', schema);
