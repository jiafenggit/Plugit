'use strict';

const PlugitError = require('../utils/PlugitError');
//Super workflow for extends;
class Workflow {
  constructor() {
  }

  get component() {
    return [
      
    ];
  }

}

Workflow.type = 'Base';

module.exports = Workflow;

//Design the receptacle;
module.exports.blueprints = [
  {
    group: 'Base',
    workflow: 'test',
    receptacle: 'component',
    type: 'Base',
    description: 'Test workflow'
  }
];