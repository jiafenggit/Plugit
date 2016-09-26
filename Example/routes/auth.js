const Joi = require('koa-joi-router').Joi;
const jwt = require('koa-jwt');

module.exports = {
  groupName: 'Auth',
  description: 'Auth API',
  extendedDescription: 'Just get the token!',
  prefix: '/auth',
  routes: [{
    method: 'post',
    path: '/',
    handler: function * () {
      const now = new Date();
      const token = jwt.sign({
        exp: '1 hour'.after(now).unix,
        roles: ['admin']
      }, 'Joker');
      this.body = {
        jwt: token
      };
      this.cookies.set('jwt', token, {
        signed: true,
        expires: '1 hour'.after(now)
      });
    }
  }]
};