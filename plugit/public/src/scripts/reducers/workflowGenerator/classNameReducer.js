/**
 * Created by miserylee on 16/8/19.
 */
import {WORKFLOW_GENERATOR_EDIT_CLASS_NAME, WORKFLOW_GENERATOR_RESET, WORKFLOW_GENERATOR_TOGGLE_CLASS_NAME_BOX} from '../../actions/workflowGenerator';

const INITIAL_STATE = {className: null, show: false};

import {REHYDRATE} from 'redux-persist/constants';

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REHYDRATE:
    {
      const persistState = action.payload.workflowGenerator_classNameReducer;
      return Object.assign({}, state, persistState, {show: !persistState || !persistState.className});
    }
    case WORKFLOW_GENERATOR_EDIT_CLASS_NAME:
      return {className: action.className, show: false};
    case WORKFLOW_GENERATOR_TOGGLE_CLASS_NAME_BOX:
      return Object.assign({}, state, {show: !state.show});
    case WORKFLOW_GENERATOR_RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}