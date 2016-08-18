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

  * _connect(key, options) {
    return yield new Promise((resolve, reject) => {
      const conn = mongoose.createConnection();

      conn.on('error', err => {
        conn.close();
        reject(err);
      });
      conn.on('close', _ => this.plugit.error(`Database [${key}] closed!`));
      conn.on('connected', _ => {
        this.plugit.log(`Database [${key}] has connected!`);
        resolve(conn);
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
      if(options.replica) {
        conn.openSet(options.uri, options.name, Object.assign(defaultOptions, options.options || {}));
      } else {
        conn.open(options.host, options.name, options.port, Object.assign(defaultOptions, options.options || {}));
      }
      this.connections[key] = conn;

    });
  }

  start() {
    return co(function* () {
      let models = {};
      for(let key of Object.keys(this.databases)) {
        const options = this.databases[key];
        yield this._connect(key, options);
        let historyKey;
        if(options.history) {
          historyKey = [key, 'History'].join('');
          yield this._connect(historyKey, options.history);
        }
        Object.assign(models, this._registModels(options, key, historyKey));
      }

      return models;
    }.bind(this));
  }

  _registModels(options, DBKey, historyDBKey) {
    const schemas = options.schemas || {};
    if (!(schemas instanceof Object)) throw new PlugitError('Schemas must be an Object');
    const models = {};
    Object.keys(schemas).forEach(key => {
      const schema = schemas[key];
      if (!(schema instanceof mongoose.Schema)) throw new PlugitError(`Schema [${key}] is not a instance of mongoose Schema`);
      const modelName = [DBKey, key].join('/');
      if (models[modelName]) throw new PlugitError(`Database [${DBKey}] has registed model [${modelName}]`);
      models[modelName] = this.connections[DBKey].model(key.toUnderlineCase(), schema);
      this.plugit.log(`Database [${DBKey}] regist model [${modelName}] success!`);
    });
    // only business models should record history;
    if(DBKey !== 'core' && historyDBKey) {
      Object.keys(schemas).forEach(key => {
        key = [key, 'History'].join('');
        const modelName = [historyDBKey, key].join('/');
        if (models[modelName]) throw new PlugitError(`Database [${historyDBKey}] has registed model [${modelName}]`);
        models[modelName] = this.connections[historyDBKey].model(key.toUnderlineCase(), historySchema);
        this.plugit.log(`Database [${historyDBKey}] regist model [${modelName}] success!`);
      });
    }
    return models;
  }
}

module.exports = Database;