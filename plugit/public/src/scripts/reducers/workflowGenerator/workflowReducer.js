/**
 * Created by miserylee on 16/8/19.
 */
import {
  WORKFLOW_GENERATOR_WORKFLOW_TOGGLE_INJECT_TRANSACTION,
  WORKFLOW_GENERATOR_ADD_WORKFLOW,
  WORKFLOW_GENERATOR_REMOVE_WORKFLOW,
  WORKFLOW_GENERATOR_ADD_WORKER,
  WORKFLOW_GENERATOR_REMOVE_WORKER,
  WORKFLOW_GENERATOR_EDIT_WORKER,
  WORKFLOW_GENERATOR_RESET,
  WORKFLOW_GENERATOR_TOGGLE_ADD_WORKFLOW_BOX,
  WORKFLOW_GENERATOR_CHECK_WORKFLOW_NAME_EXISTS,
  WORKFLOW_GENERATOR_SELECT_WORKFLOW,
  WORKFLOW_GENERATOR_WORKFLOW_CHANGE_NAME
} from '../../actions/workflowGenerator';

const INITIAL_STATE = {workflow: {}, showAddWorkflowBox: false, error: null, selectedWorkflow: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case WORKFLOW_GENERATOR_TOGGLE_ADD_WORKFLOW_BOX:
      return Object.assign({}, state, {showAddWorkflowBox: !state.showAddWorkflowBox});
    case WORKFLOW_GENERATOR_CHECK_WORKFLOW_NAME_EXISTS:
      return Object.assign({}, state, {error: !state.workflow[action.name] ? null : '该工作流已经存在,请更换一个名字'});
    case WORKFLOW_GENERATOR_ADD_WORKFLOW:
    {
      if (state.workflow[action.name]) return Object.assign({}, state, {error: '该工作流已经存在,请更换一个名字'});
      const workflow = {};
      workflow[action.name] = {injectTransaction: true, workers: []};
      return Object.assign({}, state, {
        workflow: Object.assign({}, state.workflow, workflow),
        showAddWorkflowBox: false,
        error: null,
        selectedWorkflow: action.name
      });
    }
    case WORKFLOW_GENERATOR_SELECT_WORKFLOW:
      return Object.assign({}, state, {selectedWorkflow: action.name});
    case WORKFLOW_GENERATOR_REMOVE_WORKFLOW:
    {
      delete state.workflow[action.name];
      if (action.name === state.selectedWorkflow) {
        state.selectedWorkflow = Object.keys(state.workflow)[0] || null;
      }
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow)});
    }
    case WORKFLOW_GENERATOR_WORKFLOW_TOGGLE_INJECT_TRANSACTION:
    {
      state.workflow[action.name] = Object.assign({}, state.workflow[action.name], {injectTransaction: !state.workflow[action.name].injectTransaction});
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow)});
    }
    case WORKFLOW_GENERATOR_WORKFLOW_CHANGE_NAME:
    {
      if (state.workflow[action.newName]) return Object.assign({}, state, {error: '该工作流已经存在,请更换一个名字'});
      const newWorkflow = {};
      newWorkflow[action.newName] = Object.assign({}, state.workflow[action.name]);
      delete state.workflow[action.name];
      if (action.name === state.selectedWorkflow) {
        state.selectedWorkflow = action.newName;
      }
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow, newWorkflow)});
    }
    case WORKFLOW_GENERATOR_ADD_WORKER:
    {
      let workers = state.workflow[action.workflowName].workers;
      workers.splice(action.index, 0, {
        receptacle: '',
        type: '',
        description: '',
        operation: '',
        workChecksum: '',
        queryBinder: 'payload => {\n  \n}',
        idBinder: 'payload => {\n  \n}',
        paramsMapper: 'payload => [\n  \n]',
        packager: '(result, payload) => {\n  \n}',
        dispatcher: '(result, payload) => {\n  \n}',
        danger: true
      });
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow)});
    }
    case WORKFLOW_GENERATOR_REMOVE_WORKER:
    {
      let workers = state.workflow[action.workflowName].workers;
      workers.splice(action.index, 1);
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow)});
    }
    case WORKFLOW_GENERATOR_EDIT_WORKER:
    {
      let workers = state.workflow[action.workflowName].workers;
      Object.assign(workers[action.index], action.worker);
      state.workflow[action.workflowName].workers = workers;
      return Object.assign({}, state, {workflow: Object.assign({}, state.workflow)});
    }
    case WORKFLOW_GENERATOR_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}