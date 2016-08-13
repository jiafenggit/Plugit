import { combineReducers } from 'redux';
import componentMapsReducer from './componentMapsReducer';
import componentMapsGroupsReducer from './componentMapsGroupsReducer';
import componentInfoReducer from './componentInfoReducer';
import componentsByTypeReducer from './componentsByTypeReducer';
import appReducer from './app';

const rootReducer = combineReducers({
  appReducer,
  componentMapsReducer,
  componentMapsGroupsReducer,
  componentInfoReducer,
  componentsByTypeReducer
});

export default rootReducer;