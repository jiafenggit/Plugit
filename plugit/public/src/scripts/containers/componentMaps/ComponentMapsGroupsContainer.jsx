import {connect} from 'react-redux';

import ComponentMapsGroups from '../../components/componentMaps/ComponentMapsGroups';

const ComponentMapsGroupsContainer = connect(state => state.componentMaps_componentMapsGroupsReducer)(ComponentMapsGroups);

export default ComponentMapsGroupsContainer;