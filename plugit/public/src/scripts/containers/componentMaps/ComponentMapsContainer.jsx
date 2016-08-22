import { connect } from 'react-redux';

import ComponentMaps from '../../components/componentMaps/ComponentMaps';

const ComponentMapsContainer = connect(state => {
  const activeGroup = state.componentMaps_componentMapsGroupsReducer.data[state.componentMaps_componentMapsGroupsReducer.activeIndex];
  return Object.assign({}, state.componentMaps_componentMapsReducer, { activeGroup });
})(ComponentMaps);

export default ComponentMapsContainer;