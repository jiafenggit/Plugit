import { connect } from 'react-redux';
import componentMapsActions from '../actions/componentMaps';

import ComponentMaps from '../components/componentMaps/ComponentMaps';

const ComponentMapsContainer = connect(state => {
  const activeGroup = state.componentMapsGroupsReducer.data[state.componentMapsGroupsReducer.activeIndex];
  return Object.assign({}, state.componentMapsReducer, { activeGroup });
})(ComponentMaps);

export default ComponentMapsContainer;