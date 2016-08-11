import {connect} from 'react-redux';
import componentMapsGroupsActions from '../actions/componentMapsGroups';

import ComponentMapsGroups from '../components/componentMaps/ComponentMapsGroups';

const ComponentMapsGroupsContainer = connect(state => state.componentMapsGroupsReducer)(ComponentMapsGroups);

export default ComponentMapsGroupsContainer;