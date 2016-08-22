import {connect} from 'react-redux';

import ComponentsByType from '../../components/componentMaps/ComponentsByType';

const ComponentsByTypeContainer = connect(state => {
  const activeMap = state.componentMaps_componentMapsReducer.activeIndex;
  if (!activeMap) return {};
  const temp = activeMap.split('/');
  const workflow = temp[0];
  const index = parseInt(temp[1]);
  if(!state.componentMaps_componentMapsReducer.data[workflow]) return {};
  return Object.assign({}, state.componentMaps_componentsByTypeReducer, {componentMap: state.componentMaps_componentMapsReducer.data[workflow][index]});
})(ComponentsByType);

export default ComponentsByTypeContainer;