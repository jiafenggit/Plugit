import {connect} from 'react-redux';

import Workflow from '../../components/workflowGenerator/Workflow';

const WorkflowContainer = connect(state => state.workflowGenerator_workflowReducer)(Workflow);

export default WorkflowContainer;