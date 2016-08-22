import {connect} from 'react-redux';

import CurrentInstalledComponent from '../../components/componentMaps/CurrentInstalledComponent';

const ComponentInfoContainer = connect(state => {
  const activeMap = state.componentMaps_componentMapsReducer.activeIndex;
  if (!activeMap) return {};
  const temp = activeMap.split('/');
  const workflow = temp[0];
  const index = parseInt(temp[1]);
  if(!state.componentMaps_componentMapsReducer.data[workflow]) return {};
  const {data, activeIndex} = state.componentMaps_componentMapsReducer;
  return Object.assign({}, state.componentMaps_componentInfoReducer, {componentMap: data[workflow][index], activeIndex});
})(CurrentInstalledComponent);

export default ComponentInfoContainer;