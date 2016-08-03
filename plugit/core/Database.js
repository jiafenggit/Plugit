'use strict';
const PlugitError = require('../utils/PlugitError');

const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongooseTimestamp = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseRollbackable = require('../utils/mongoose-rollbackable');
mongoose.plugin(mongooseTimestamp);
mongoose.plugin(mongooseRollbackable);
mongoose.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

class Database {
  constructor(plugit) {
    const {options} = plugit;
    const databases = options.databases;
    if (!databases.core) throw new PlugitError('Require a core database in databases config');
    Object.keys(databases).forEach(key => {
      const database = databases[key];
      if (!database.host) throw new PlugitError(`Database [${key}] host is required!`);
      if (!database.port) throw new PlugitError(`Database [${key}] port is required!`);
      if (!database.name) throw new PlugitError(`Database [${key}] name is required!`);
    });
    this._databases = options.databases;
    this._plugit = plugit;
    this._connections = {};
  }

  get connections() {
    return this._connections;
  }

  get databases() {
    return this._databases;
  }

  get plugit() {
    return this._plugit;
  }

  start() {
    const promises = Object.keys(this.databases).map(key => {
      return new Promise((resolve, reject) => {
        const database = this.databases[key];
        const conn = mongoose.createConnection();

        conn.on('error', err => {
          conn.close();
          reject(err);
        });
        conn.on('close', _ => this.plugit.error(`Database [${key}] closed!`));
        conn.on('connected', _ => {
          this.plugit.log(`Database [${key}] has connected!`);
          resolve(this._registModels(conn, database, key));
        });

        conn.open(database.host, database.name, database.port, Object.keys({
          db: { native_parser: true },
          server: {
            poolSize: 100,
            auto_reconnect: true,
            socketOptions: { keepAlive: 1 }
          },
          user: '',
          pass: '',
        }, database.options));
        this.connections[key] = conn;

      });
    });

    return co(function* () {
      let models = {};
      for (let promise of promises) {
        Object.assign(models, yield promise);
      }
      return models;
    }.bind(this));
  }

  _registModels(conn, database, dbKey) {
    const schemas = database.schemas || {};
    if (!(schemas instanceof Object)) throw new PlugitError('Schemas must be an Object');
    const models = {};
    Object.keys(schemas).forEach(key => {
      const schema = schemas[key];
      if (!(schema instanceof mongoose.Schema)) throw new PlugitError(`Schema [${key}] is not a instance of mongoose Schema`);
      const model = conn.model(key.toUnderlineCase(), schema);
      if (models[[dbKey, key].join('/')]) throw new PlugitError(`Databse [${dbKey}] has registed model [${dbKey}/${key}]`);
      models[[dbKey, key].join('/')] = model;
      this.plugit.log(`Database [${dbKey}] regist model [${dbKey}/${key}] success!`);
    });
    return models;
  }
}

module.exports = Database;