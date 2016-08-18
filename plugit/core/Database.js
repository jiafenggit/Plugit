'use strict';
const PlugitError = require('../utils/PlugitError');

const co = require('co');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const mongooseTimestamp = require('mongoose-timestamp');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseRollbackable = require('../utils/mongoose-rollbackable');
mongoose.plugin(mongooseTimestamp);
mongoose.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });
mongoose.plugin(mongooseRollbackable);

const historySchema = require('../schemas/History');

const HISTORY_DB_KEY = 'history';

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
    if (!this.plugit.options.enableHistory) {
      delete this.databases.history;
    }
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
        const defaultOptions = {
          db: { native_parser: true },
          server: {
            poolSize: 50,
            auto_reconnect: true,
            socketOptions: { keepAlive: 1 }
          },
          user: '',
          pass: '',
        };
        if(database.replica) {
          conn.openSet(database.uri, database.name, Object.assign(defaultOptions, database.options || {}));
        } else {
          conn.open(database.host, database.name, database.port, Object.assign(defaultOptions, database.options || {}));
        }
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
    // history database can not regist any models, just ignore the schemas;
    if(dbKey === 'history') return {};
    const schemas = database.schemas || {};
    if (!(schemas instanceof Object)) throw new PlugitError('Schemas must be an Object');
    const models = {};
    const historyConnection = this.connections[HISTORY_DB_KEY];
    Object.keys(schemas).forEach(key => {
      const schema = schemas[key];
      if (!(schema instanceof mongoose.Schema)) throw new PlugitError(`Schema [${key}] is not a instance of mongoose Schema`);
      if (models[[dbKey, key].join('/')]) throw new PlugitError(`Database [${dbKey}] has registed model [${dbKey}/${key}]`);
      models[[dbKey, key].join('/')] = conn.model(key.toUnderlineCase(), schema);
      this.plugit.log(`Database [${dbKey}] regist model [${dbKey}/${key}] success!`);
      // only business models should record history;
      if(dbKey !== 'core' && this.plugit.options.enableHistory) {
        const historyKey = [key, 'History'].join('');
        if (models[[HISTORY_DB_KEY, historyKey].join('/')]) throw new PlugitError(`Database [${HISTORY_DB_KEY}] has registed model [${HISTORY_DB_KEY}/${historyKey}]`);
        models[[HISTORY_DB_KEY, historyKey].join('/')] = historyConnection.model(historyKey.toUnderlineCase(), historySchema);
        this.plugit.log(`Database [${HISTORY_DB_KEY}] regist model [${HISTORY_DB_KEY}/${historyKey}] success!`);
      }
    });
    return models;
  }
}

module.exports = Database;