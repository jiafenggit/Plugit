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

app.compress();

app.cache();

app.ratelimit();

app.cors();

app.jwt({
  secret: 'Joker',
  cookie: 'jwt',
  passthrough: true
});

app.serve(path.resolve(__dirname, 'public'));

app.rbac();

app.autoDocsAndRouter('/docs', {
  title: 'Plugit API',
  version: '1.0.0',
  theme: 'superhero'
}, path.resolve(__dirname, 'routes'));

app.listen(3000);

// setTimeout(function () {
//   console.log(Plugit.cage);
// }, 2000);