import {connect} from 'react-redux';

import ComponentsByType from '../components/componentMaps/ComponentsByType';

const ComponentsByTypeContainer = connect(state => {
  const activeMap = state.componentMapsReducer.activeIndex;
  if (!activeMap) return {};
  const temp = activeMap.split('/');
  const workflow = temp[0];
  const index = parseInt(temp[1]);
  if(!state.componentMapsReducer.data[workflow]) return {};
  return Object.assign({}, state.componentsByTypeReducer, {componentMap: state.componentMapsReducer.data[workflow][index]});
})(ComponentsByType);

export default ComponentsByTypeContainer;