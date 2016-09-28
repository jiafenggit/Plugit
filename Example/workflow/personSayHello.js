
const Workflow = require('sungorus').Workflow;
const Work = Workflow.Work;
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = new Workflow([
  new Work({
    packager: _ => {
      return {
        person: {
          id: new ObjectId
        }
      };
    },
    dispatcher: _ => ['Person create', 'Person sayHello', 'Person updateName', 'Person getEntity'],
    description: 'Dispatch initial actions'
  }),
  new Work({
    componentMap: {
      history: true,
      name: 'Misery',
      type: 'Person',
      defaultComponent: 'Person',
      description: 'Person component in workflow personSayHello'
    },
    operation: 'create',
    propsMapper: payload => [payload.person.id],
    paramsMapper: payload => [payload.inbound.name, payload.inbound.gender],
    packager: result => {
      return {person: result};
    }
  }),
  new Work({
    componentMap: {
      safe: true
    },
    propsMapper: payload => [payload.person.id],
    operation: 'sayHello',
    paramsMapper: payload => [payload.inbound.friend],
    packager: result => {
      return {temp: result};
    },
    description: 'Say hello to friend.'
  }),
  new Work({
    componentMap: {
      history: true
    },
    propsMapper: payload => [payload.person.id],
    operation: 'updateName',
    paramsMapper: payload => [payload.inbound.friend],
    description: 'Update name to the same of friend'
  }),
  new Work({
    componentMap: {
      safe: true
    },
    operation: 'getEntity',
    propsMapper: payload => [payload.person.id],
    packager: (result, payload) => {
      return {outbound: `${payload.temp}, and change self to ${result.name}`};
    }
  }),
  // new Work({
  //   dispatcher: _ => {
  //     throw new Error('Booooooooooooooooom!');
  //   }
  // })
], {
  description: 'Say hello.',
  mq: [{
    operation: 'sendMail',
    paramsMapper: payload => {
      return [{
        to: payload.person.id,
        content: payload.outbound
      }];
    }
  }]
});