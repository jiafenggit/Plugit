require('tlan');

const koa = require('koa');
const koaSungorus = require('koa-sungorus');
const sungorusHistory = require('sungorus-history').plugin;
const sungorusMQ = require('sungorus-mq');
const dirTraveler = require('dir-traveler');

const debug = require('debug')('plugit');

class Plugit {
  constructor (name, {
    keys = ['Plugit', 'Sungorus', 'I like them!'],
    cacheman = {},
    mq = {},
    plugins = [],
    componentPath,
    workflowPath,
    consumerPath,
    errorListener = err => console.error(err)
  } = {}) {
    this._start = new Date();

    debug(`[${name}] init start at ${this._start.format('yyyy-MM-dd hh:mm:ss.S')}`);
    if (!name && typeof name === 'string') throw new Error(`name is required and it should be string, but got ${name}`);

    if(mq.enable && consumerPath) {
      const consumers = dirTraveler(consumerPath);
      Object.keys(consumers).forEach(key => {
        consumers[key] = require(consumers[key]);
        debug(`[${name}] register mq consumer [${key}]`);
      });
      mq.consumers = mq.consumers || {};
      Object.assign(mq.consumers, consumers);

      if(!mq.uri) mq.uri = 'mongodb://localhost:27017/plugit';

      plugins.push([sungorusMQ, mq]);
    }

    const defaultOptions = {
      cacheman: Object.assign({
        host: 'localhost',
        port: 27017,
        database: 'plugit'
      }, cacheman),
      plugins: [
        [sungorusHistory],
        ...plugins
      ],
      componentPath,
      workflowPath
    };

    this._name = name;

    this._app = koa();
    this._app.keys = keys;

    // validate
    // https://github.com/RocksonZeta/koa-validate
    const validate = require('koa-validate');
    validate(this._app);

    // default use koa-sungorus middleware
    this._app.use(koaSungorus(name, defaultOptions, (err, result) => {
      if(err) console.error(err);
      else debug(result);
    }));

    // error listener
    this._app.on('error', errorListener);

    debug(`[${name}] init success at ${new Date().format('yyyy-MM-dd hh:mm:ss.S')}`);
  }

  get core () {
    return this._app;
  }

  // use middleware, all the koa middleware are supported;
  use (middleware) {
    return this._app.use(middleware);
  }

  // serve static root
  // https://github.com/koajs/static
  serve (root, options) {
    debug(`[${this._name}] use middleware [koa-static]`);
    const serve = require('koa-static');
    return this._app.use(serve(root, options));
  }

  // jwt
  // https://github.com/koajs/jwt
  jwt (options) {
    debug(`[${this._name}] use middleware [koa-jwt]`);
    const jwt = require('koa-jwt');
    return this._app.use(jwt(options));
  }

  // rbac
  // https://github.com/yanickrochon/koa-rbac
  rbac (rules = require('../utils/rbac/rules.json'), options = {}) {
    debug(`[${this._name}] use middleware [koa-rbac]`);
    const rbac = require('koa-rbac');
    const RBACProvider = require('../utils/rbac/RBACProvider');
    return this._app.use(rbac.middleware(Object.assign({
      rbac: new rbac.RBAC({
        provider: new RBACProvider(rules)
      }),
      identity: ctx => {
        if(ctx.state) {
          if (!ctx.state.user) ctx.throw(401);
          return ctx.state.user;
        }
      }
    }, options)));
  }

  // cors
  // https://github.com/evert0n/koa-cors
  cors (options = {}) {
    debug(`[${this._name}] use middleware [koa-cors]`);
    const cors = require('koa-cors');
    return this._app.use(cors(Object.assign({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }, options)));
  }

  // ratelimit
  // https://github.com/tunnckoCore/koa-better-ratelimit
  ratelimit (options = {}) {
    debug(`[${this._name}] use middleware [koa-better-ratelimit]`);
    const ratelimit = require('koa-better-ratelimit');
    return this._app.use(ratelimit(Object.assign({
      duration: 6e4, // 1 min
      max: 60,
      accessLimited: 'Too Many Requests',
      accessForbidden: 'Forbidden'
    }, options)));
  }

  // compress
  // https://github.com/koajs/compress
  compress (options = {}) {
    debug(`[${this._name}] use middleware [koa-compress]`);
    const compress = require('koa-compress');
    return this._app.use(compress(Object.assign({
      filter: function (contentType) {
        return /text/i.test(contentType)
      },
      threshold: 1024,
      flush: require('zlib').Z_SYNC_FLUSH
    }, options)));
  }

  // cache
  // https://github.com/koajs/etag
  // https://github.com/koajs/conditional-get
  cache () {
    debug(`[${this._name}] use middleware [koa-etag] & [koa-conditional-get]`);
    const conditional = require('koa-conditional-get');
    const etag = require('koa-etag');
    this._app.use(conditional());
    return this._app.use(etag());
  }

  // koa-docs
  // https://github.com/a-s-o/koa-docs
  docs (path, options) {
    debug(`[${this._name}] use middleware [koa-docs]`);
    const docs = require('koa-docs');
    return this._app.use(docs.get(path, options));
  }

  // koa-joi-router
  // https://github.com/koajs/joi-router
  router ({routes, prefix} = {}, name = 'no name') {
    const router = require('koa-joi-router')();
    router.route(routes);
    router.prefix(prefix);
    this._app.use(router.middleware());
    debug(`[${this._name}] router [${name}] success!`);
  }

  // auto docs
  autoDocs (path, options = {}, routesPath) {
    const routes = dirTraveler(routesPath);
    options.groups = options.groups || [];
    options.groups.push(...Object.keys(routes).map(key => require(routes[key])));
    return this.docs(path, options);
  }

  // auto router
  autoRouter (routesPath) {
    const routes = dirTraveler(routesPath);
    Object.keys(routes).forEach(key => this.router(require(routes[key]), key.slice(0, key.lastIndexOf('.'))));
  }

  // auto docs & router
  autoDocsAndRouter (path, options = {}, routesPath) {
    const routes = dirTraveler(routesPath);
    options.groups = options.groups || [];
    options.groups.push(...Object.keys(routes).map(key => require(routes[key])));
    this.docs(path, options);
    Object.keys(routes).forEach(key => this.router(require(routes[key]), key.slice(0, key.lastIndexOf('.'))));
  }

  // logger
  logger () {
    debug(`[${this._name}] use middleware [logger]`);
    const logger = require('../middleware/logger');
    return this._app.use(logger());
  }

  // jsonError
  jsonError () {
    debug(`[${this._name}] use middleware [jsonError]`);
    const jsonError = require('../middleware/jsonError');
    return this._app.use(jsonError());
  }

  // koaSungorus componentMap
  componentMap (componentMap) {
    debug(`[${this._name}] use componentMap`);
    return this._app.use(koaSungorus.componentMap(componentMap));
  }

  // listen
  listen (port, cb = _ => _) {
    return this._app.listen(port, _ => {
      this._end = new Date();
      debug(`[${this._name}] listen port [${port}] success at ${this._end.format('yyyy-MM-dd hh:mm:ss.S')}`);
      debug(`[${this._name}] start cost ${this._end.getTime() - this._start.getTime()}ms`);
      cb();
    });
  }

}

module.exports = Plugit;

module.exports.cage = koaSungorus.cage;