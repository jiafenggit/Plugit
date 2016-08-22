/**
 * Created by miserylee on 16/8/19.
 */
import {
  WORKFLOW_GENERATOR_ADD_DEPENDENCE,
  WORKFLOW_GENERATOR_REMOVE_DEPENDENCE,
  WORKFLOW_GENERATOR_RESET,
  WORKFLOW_GENERATOR_CHECK_DEPENDENCE_KEY_EXISTS,
  WORKFLOW_GENERATOR_TOGGLE_ADD_DEPENDENCE_BOX
} from '../../actions/workflowGenerator';

const INITIAL_STATE = {dependencies: {}, error: null, showAddDependenceBox: false};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case WORKFLOW_GENERATOR_TOGGLE_ADD_DEPENDENCE_BOX:
      return Object.assign({}, state, {showAddDependenceBox: !state.showAddDependenceBox});
    case WORKFLOW_GENERATOR_CHECK_DEPENDENCE_KEY_EXISTS:
      return Object.assign({}, state, {error: !state.dependencies[action.key] ? null : '该依赖项已经存在,请更换一个名字'});
    case WORKFLOW_GENERATOR_ADD_DEPENDENCE:
    {
      if(state.dependencies[action.key]) return Object.assign({}, state, {error: '该依赖项已经存在,请更换一个名字'});
      let dependencies = {};
      dependencies[action.key] = action.requirePath;
      return Object.assign({}, state, {
        dependencies: Object.assign({}, state.dependencies, dependencies),
        showAddDependenceBox: false,
        error: null
      });
    }
    case WORKFLOW_GENERATOR_REMOVE_DEPENDENCE:
    {
      delete state.dependencies[action.key];
      return Object.assign({}, state, {error: null, showAddDependenceBox: false});
    }
    case WORKFLOW_GENERATOR_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}