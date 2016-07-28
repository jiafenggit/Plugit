'use stirct';

const conn = require('../db');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
  username: { type: String, required: [true, 'username is required!'], index: true, unique: true },
  password: { type: String, required: [true, 'password is required!'], index: true },
  name: { type: String, required: [true, 'name is required!'], index: true },
  gender: { type: String, enum: { values: ['male', 'female'], message: 'gender must in male and female!' }, required: [true, 'gender is required!'], index: true, default: 'male' }
});

module.exports = conn.model('account', schema);