/**
 * Created by miserylee on 16/8/20.
 */

import {
  WORKFLOW_GENERATOR_EXPORT,
  WORKFLOW_GENERATOR_TOGGLE_EXPORT_BOX
} from '../../actions/workflowGenerator';

const INITIAL_STATE = {showExportBox: false, data: '', error: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case WORKFLOW_GENERATOR_TOGGLE_EXPORT_BOX:
      return Object.assign({}, {showExportBox: false});
    case WORKFLOW_GENERATOR_EXPORT:
    {
      const {className} = action.data;
      if (!className) return {showExportBox: true, data: '', error: '请先填写类名'};
      return {showExportBox: true, data: render(action.data).join('\n'), error: null};
    }
    default:
      return state;
  }
}

function render({className, dependencies, workflow}) {
  let lines = [];

  lines.push(`const {Workflow, Worker} = require('@miserylee/plugit)`);

  const renderedDependencies = renderDependencies(dependencies);

  lines.push(...renderedDependencies);

  let renderedWorkflow = [];
  Object.keys(workflow).forEach(workflowName => {
    const workers = workflow[workflowName].workers.map(worker => renderWorker(className, workflowName, worker));
    renderedWorkflow.push(...renderWorkflow(workflowName, workflow[workflowName].injectTransaction, workers));
  });

  lines.push(...renderClass(className, renderedWorkflow));

  lines.push(...renderBluePrints(className, workflow));

  lines.push(`module.exports = ${className}`);

  return lines;

}

function renderBluePrints(className, workflow) {
  let lines = [`${className}.componentBlueprints = []`];
  Object.keys(workflow).forEach(workflowName => {
    lines.push(`${className}.componentBlueprints.push({`);
    let shouldRender = false;
    workflow[workflowName].workers.forEach(worker => {
      if(worker.receptacle && worker.type) {
        shouldRender = true;
        lines.push(...appendTab([
          `group: '${className}'`,
          `workflow: '${workflowName}'`,
          `receptacle: '${worker.receptacle}'`,
          `type: '${worker.type}'`,
          `description: '${worker.description}'`
        ]));
        lines.push(`}, {`);
      }
    });
    if(shouldRender) {
      lines.splice(-1, 1, `});`);
    } else {
      lines.splice(-1, 1);
    }
  });
  return lines;
}

function renderDependencies(dependencies) {
  return Object.keys(dependencies).map(key => `const ${key} = require('${dependencies[key]}')`);
}

function renderClass(className, renderedWorkflow) {
  let lines = [`class ${className} extends Workflow {`];
  lines.push(...appendTab(renderedWorkflow));
  lines.push('}');
  return lines;
}

function renderWorker(className, workflowName, {receptacle, operation, workChecksum, queryBinder, idBinder, paramsMapper, packager, dispatcher, danger}) {
  let lines = [`new Worker({`];
  if (receptacle) lines.push(...appendTab(`componentMap: ${className}/${workflowName}/${receptacle}`));
  if (operation) lines.push(...appendTab(`operation: ${operation}`));
  if (workChecksum) lines.push(...appendTab(`workChecksum: ${workChecksum}`));
  if (idBinder) lines.push(...appendTab(`idBinder: ${idBinder}`));
  if (queryBinder) lines.push(...appendTab(`queryBinder: ${queryBinder}`));
  if (paramsMapper) lines.push(...appendTab(`paramsMapper: ${paramsMapper}`));
  if (packager) lines.push(...appendTab(`packager: ${packager}`));
  if (dispatcher) lines.push(...appendTab(`dispatcher: ${dispatcher}`));
  if (!danger) lines.push(...appendTab(`danger: false`));
  lines.push('}),');
  return lines;
}

function renderWorkflow(workflowName, injectTransaction, renderedWorkers) {
  let lines = [`get ${workflowName} () {`, ...appendTab('return {')];
  if(!injectTransaction) lines.push(...appendTab(`injectTransaction: false`, 2));
  lines.push(...appendTab(`workers: [`, 2));
  renderedWorkers.forEach(worker => {
    console.log(appendTab(worker, 3));
    lines.push(...appendTab(worker, 3));
  });
  lines.push(...appendTab(']', 2));
  lines.push(...appendTab('})'));
  lines.push('}');
  return lines;
}

function t(n) {
  return new Array(n).fill('\t').join('');
}

function appendTab(data, n = 1) {
  if (Array.isArray(data)) {
    return data.map(item => `${t(n)}${item}`);
  } else {
    return data.split('\n').map(item => `${t(n)}${item}`);
  }
}