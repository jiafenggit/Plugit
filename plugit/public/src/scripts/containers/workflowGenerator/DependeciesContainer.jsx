import {connect} from 'react-redux';

import Dependencies from '../../components/workflowGenerator/Dependencies';

const DependenciesContainer = connect(state => state.workflowGenerator_dependenceReducer)(Dependencies);

export default DependenciesContainer;