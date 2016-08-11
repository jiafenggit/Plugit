import {connect} from 'react-redux';

import CurrentInstalledComponent from '../components/componentMaps/CurrentInstalledComponent';

const ComponentInfoContainer = connect(state => {
  const activeMap = state.componentMapsReducer.activeIndex;
  if (!activeMap) return {};
  const temp = activeMap.split('/');
  const workflow = temp[0];
  const index = parseInt(temp[1]);
  if(!state.componentMapsReducer.data[workflow]) return {};
  const {data, activeIndex} = state.componentMapsReducer;
  return Object.assign({}, state.componentInfoReducer, {componentMap: data[workflow][index], activeIndex});
})(CurrentInstalledComponent);

export default ComponentInfoContainer;