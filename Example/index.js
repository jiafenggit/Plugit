const Plugit = require('../');

const path = require('path');

const app = new Plugit('Joker', {
  cacheman: {
    host: 'localhost',
    port: 27017,
    database: 'plugitSungorus'
  },
  componentPath: path.resolve(__dirname, 'components'),
  workflowPath: path.resolve(__dirname, 'workflow')
}, err => err);

app.jsonError();

app.logger();

app.cache();

app.ratelimit();

app.cors();

app.jwt({
  secret: 'Joker',
  cookie: 'jwt',
  passthrough: true
});

app.compress();

app.serve(path.resolve(__dirname, 'public'));

app.rbac();

const routesPath = path.resolve(__dirname, 'routes');

app.autoDocs('/docs', {
  title: 'Plugit API',
  version: '1.0.0',
  theme: 'superhero'
}, routesPath);

app.autoRouter(routesPath);

app.listen(3000);

// setTimeout(function () {
//   console.log(Plugit.cage);
// }, 2000);