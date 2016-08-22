/**
 * Created by miserylee on 16/8/19.
 */

export const WORKFLOW_GENERATOR_TOGGLE_CLASS_NAME_BOX = 'WORKFLOW_GENERATOR_TOGGLE_CLASS_NAME_BOX';
export const WORKFLOW_GENERATOR_EDIT_CLASS_NAME = 'WORKFLOW_GENERATOR_EDIT_CLASS_NAME';

export const WORKFLOW_GENERATOR_ADD_DEPENDENCE = 'WORKFLOW_GENERATOR_ADD_DEPENDENCE';
export const WORKFLOW_GENERATOR_REMOVE_DEPENDENCE = 'WORKFLOW_GENERATOR_REMOVE_DEPENDENCE';
export const WORKFLOW_GENERATOR_TOGGLE_ADD_DEPENDENCE_BOX = 'WORKFLOW_GENERATOR_TOGGLE_ADD_DEPENDENCE_BOX';
export const WORKFLOW_GENERATOR_CHECK_DEPENDENCE_KEY_EXISTS = 'WORKFLOW_GENERATOR_CHECK_DEPENDENCE_KEY_EXISTS';

export const WORKFLOW_GENERATOR_ADD_WORKFLOW = 'WORKFLOW_GENERATOR_ADD_WORKFLOW';
export const WORKFLOW_GENERATOR_REMOVE_WORKFLOW = 'WORKFLOW_GENERATOR_REMOVE_WORKFLOW';
export const WORKFLOW_GENERATOR_TOGGLE_ADD_WORKFLOW_BOX = 'WORKFLOW_GENERATOR_TOGGLE_ADD_WORKFLOW_BOX';
export const WORKFLOW_GENERATOR_CHECK_WORKFLOW_NAME_EXISTS = 'WORKFLOW_GENERATOR_CHECK_WORKFLOW_NAME_EXISTS';
export const WORKFLOW_GENERATOR_SELECT_WORKFLOW = 'WORKFLOW_GENERATOR_SELECT_WORKFLOW';
export const WORKFLOW_GENERATOR_WORKFLOW_TOGGLE_INJECT_TRANSACTION = 'WORKFLOW_GENERATOR_WORKFLOW_TOGGLE_INJECT_TRANSACTION';
export const WORKFLOW_GENERATOR_WORKFLOW_CHANGE_NAME = 'WORKFLOW_GENERATOR_WORKFLOW_CHANGE_NAME';

export const WORKFLOW_GENERATOR_ADD_WORKER = 'WORKFLOW_GENERATOR_ADD_WORKER';
export const WORKFLOW_GENERATOR_REMOVE_WORKER = 'WORKFLOW_GENERATOR_REMOVE_WORKER';
export const WORKFLOW_GENERATOR_EDIT_WORKER = 'WORKFLOW_GENERATOR_EDIT_WORKER';

export const WORKFLOW_GENERATOR_RESET = 'WORKFLOW_GENERATOR_RESET';
export const WORKFLOW_GENERATOR_EXPORT = 'WORKFLOW_GENERATOR_EXPORT';
export const WORKFLOW_GENERATOR_TOGGLE_EXPORT_BOX = 'WORKFLOW_GENERATOR_TOGGLE_EXPORT_BOX';

export function toggleAddDependenceBox () {
  return {
    type: WORKFLOW_GENERATOR_TOGGLE_ADD_DEPENDENCE_BOX
  };
}

export function checkDependenceKeyExists(key) {
  return {
    type: WORKFLOW_GENERATOR_CHECK_DEPENDENCE_KEY_EXISTS,
    key
  };
}

export function toggleClassNameBox() {
  return {
    type: WORKFLOW_GENERATOR_TOGGLE_CLASS_NAME_BOX
  };
}

export function checkWorkflowNameExists(name) {
  return {
    type: WORKFLOW_GENERATOR_CHECK_WORKFLOW_NAME_EXISTS,
    name
  };
}

export function toggleAddWorkflowBox() {
  return {
    type: WORKFLOW_GENERATOR_TOGGLE_ADD_WORKFLOW_BOX
  };
}

export function selectWorkflow(name) {
  return {
    type: WORKFLOW_GENERATOR_SELECT_WORKFLOW,
    name
  };
}

export function editClassName(className) {
  return {
    type: WORKFLOW_GENERATOR_EDIT_CLASS_NAME,
    className
  };
}

export function addDependence(key, requirePath) {
  return {
    type: WORKFLOW_GENERATOR_ADD_DEPENDENCE,
    key,
    requirePath
  };
}

export function removeDependence(key) {
  return {
    type: WORKFLOW_GENERATOR_REMOVE_DEPENDENCE,
    key
  };
}

export function addWorkflow(name) {
  return {
    type: WORKFLOW_GENERATOR_ADD_WORKFLOW,
    name
  };
}

export function removeWorkflow(name) {
  return {
    type: WORKFLOW_GENERATOR_REMOVE_WORKFLOW,
    name
  };
}

export function workflowToggleInjectTransaction(name) {
  return {
    type: WORKFLOW_GENERATOR_WORKFLOW_TOGGLE_INJECT_TRANSACTION,
    name
  };
}

export function workflowChangeName(name, newName) {
  return {
    type: WORKFLOW_GENERATOR_WORKFLOW_CHANGE_NAME,
    name,
    newName
  };
}

export function addWorker(workflowName, index) {
  return {
    type: WORKFLOW_GENERATOR_ADD_WORKER,
    workflowName,
    index
  };
}

export function removeWorker(workflowName, index) {
  return {
    type: WORKFLOW_GENERATOR_REMOVE_WORKER,
    workflowName,
    index
  };
}

export function editWorker(workflowName, index, worker) {
  return {
    type: WORKFLOW_GENERATOR_EDIT_WORKER,
    workflowName,
    index,
    worker
  };
}

export function reset() {
  return {
    type: WORKFLOW_GENERATOR_RESET
  };
}

export function exportData(data) {
  return {
    type: WORKFLOW_GENERATOR_EXPORT,
    data
  };
}

export function toggleExportBox() {
  return {
    type: WORKFLOW_GENERATOR_TOGGLE_EXPORT_BOX
  };
}