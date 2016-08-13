/**
 * Created by miserylee on 16/8/12.
 */

const Schema = require('mongoose').Schema;

const schema = new Schema({
  username: {type: String, required: [true, 'username is required!'], unique: true},
  password: {type: String, required: [true, 'password is required!']},
  roles: [{type: String, enum: {values: ['plugit_manager', 'plugit_super'], message: 'role is not valid'}}]
});

module.exports = schema;