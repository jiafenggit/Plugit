'use strict';
const PlugitError = require('./utils/PlugitError');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongooseTimestamp = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseRollbackable = require('./utils/mongoose-rollbackable');
mongoose.plugin(mongooseTimestamp);
mongoose.plugin(mongooseRollbackable);
mongoose.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

class Database {
  constructor({options = {}, log, error} = {}) {
    if (!options.database.host) throw new PlugitError('Database host is required!');
    if (!options.database.port) throw new PlugitError('Database port is required!');
    if (!options.database.name) throw new PlugitError('Database name is required!');
    this._options = options.database;
    this._log = log;
    this._error = error;
  }

  get connection() {
    return this._connection;
  }

  get options() {
    return this._options;
  }

  get log() {
    return this._log;
  }

  get error() {
    return this._error;
  }

  registModels() {
    return new Promise((resolve, reject) => {
      const conn = mongoose.createConnection();

      conn.on('error', err => {
        conn.close();
        reject(err);
      });
      conn.on('close', this._handleClose.bind(this));
      conn.on('connected', _ => {
        this.log('Database has connected!');
        resolve(this._registModels());
      });

      this._connection = conn;
      this._connect();

    });
  }

  _handleClose() {
    this.error('Database closed!');
  }

  _connect() {
    const options = this.options;
    this.connection.open(options.host, options.name, options.port, options.options || {});
  }

  _registModels() {
    const schemas = this.options.schemas;
    if (!(schemas instanceof Object)) throw new PlugitError('Schemas must be an Object');
    this._models = {};
    Object.keys(schemas).forEach(key => {
      const schema = schemas[key];
      if (!(schema instanceof mongoose.Schema)) throw new PlugitError(`Schema ${key} is not a instance of mongoose Schema`);
      const model = this.connection.model(key.toUnderlineCase(), schema);
      this._models[key] = model;
      this.log(`Regist model [${key}] success!`);
    });
    return this._models;
  }
}

module.exports = Database;