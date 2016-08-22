import { combineReducers } from 'redux';
import componentMaps_componentMapsReducer from './componentMaps/componentMapsReducer';
import componentMaps_componentMapsGroupsReducer from './componentMaps/componentMapsGroupsReducer';
import componentMaps_componentInfoReducer from './componentMaps/componentInfoReducer';
import componentMaps_componentsByTypeReducer from './componentMaps/componentsByTypeReducer';
import workflowGenerator_classNameReducer from './workflowGenerator/classNameReducer';
import workflowGenerator_dependenceReducer from './workflowGenerator/dependenceReducer';
import workflowGenerator_workflowReducer from './workflowGenerator/workflowReducer';
import workflowGenerator_toolsReducer from './workflowGenerator/toolsReducer';

import appReducer from './app';

const rootReducer = combineReducers({
  appReducer,
  componentMaps_componentMapsReducer,
  componentMaps_componentMapsGroupsReducer,
  componentMaps_componentInfoReducer,
  componentMaps_componentsByTypeReducer,
  workflowGenerator_classNameReducer,
  workflowGenerator_dependenceReducer,
  workflowGenerator_workflowReducer,
  workflowGenerator_toolsReducer
});

export default rootReducer;