const Joi = require('koa-joi-router').Joi;
const rbac = require('koa-rbac');

module.exports = {
  groupName: 'Person',
  description: 'Person API',
  extendedDescription: 'Plugit is great! Sungorus is great! yeah!!!',
  prefix: '/person',
  routes: [{
    method: 'get',
    path: '/',
    handler: [rbac.allow(['admin api']), function * () {
      const Person = this.sungorus.components['Person'];
      this.body = yield Person.list();
    }]
  }, {
    method: 'get',
    path: '/sayHello',
    validate: {
      query: {
        name: Joi.string().required().description('Person name who says hello'),
        friend: Joi.string().required().description('Friend name')
      }
    },
    handler: function * () {
      this.body = yield this.sungorus.run('personSayHello', this.query);
    }
  }, {
    method: 'put',
    path: '/:id/name',
    meta: {
      friendlyName: 'Person update name',
      description: 'Returns description',
      extendedDescription: `
        # notice !!!
        ## ID is required!
      `
    },
    validate: {
      params: {
        id: Joi.string().alphanum().length(24).required().description('Person id')
      },
      body: {
        name: Joi.string().required().description('Name to update')
      },
      type: 'form',
      output: {
        200: {
          body: Joi.string().required().description('Update name result description.')
        }
      }
    },
    handler: function * () {
      this.body = yield this.sungorus.run('personUpdateName', Object.assign({}, this.request.body, this.params));
    }
  }]
};
