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
}, err => console.error(err.message));

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

const routesPerson = require('./routes/person');
const routesAuth = require('./routes/auth');

app.docs('/docs', {
  title: 'Plugit API',
  version: '1.0.0',
  theme: 'superhero',
  groups: [
    routesAuth,
    routesPerson
  ]
});

app.router(routesAuth);
app.router(routesPerson);

app.listen(3000);

// setTimeout(function () {
//   console.log(Plugit.cage);
// }, 2000);