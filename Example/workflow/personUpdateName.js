
const Workflow = require('sungorus').Workflow;
const Work = Workflow.Work;

module.exports = new Workflow([
  new Work({
    dispatcher: _ => ['Person getEntity', 'Person updateName'],
    description: 'Dispatch initial actions'
  }),
  new Work({
    componentMap: {
      safe: true,
      name: 'personUpdateName/Person',
      type: 'Person',
      defaultComponent: 'Person',
      description: 'Person component in workflow personUpdateName'
    },
    propsMapper: payload => [payload.inbound.id],
    operation: 'getEntity',
    packager: result => {
      return {
        entity: result
      }
    }
  }),
  new Work({
    componentMap: {
      history: true,
    },
    propsMapper: payload => [payload.inbound.id],
    operation: 'updateName',
    paramsMapper: payload => [payload.inbound.name],
    packager: (result, payload) => {
      return {
        outbound: `${payload.entity.name} change name to ${result.name}`
      };
    },
    description: 'Update name'
  }),
  // new Work({
  //   dispatcher: _ => {
  //     throw new Error('Booooooooooooooooom!');
  //   }
  // })
], {
  description: 'Update name.'
});