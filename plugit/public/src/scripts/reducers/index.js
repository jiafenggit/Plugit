import { combineReducers } from 'redux';
import componentMapsReducer from './componentMapsReducer';
import componentMapsGroupsReducer from './componentMapsGroupsReducer';
import componentInfoReducer from './componentInfoReducer';
import componentsByTypeReducer from './componentsByTypeReducer';

const rootReducer = combineReducers({
  componentMapsReducer,
  componentMapsGroupsReducer,
  componentInfoReducer,
  componentsByTypeReducer
});

export default rootReducer;