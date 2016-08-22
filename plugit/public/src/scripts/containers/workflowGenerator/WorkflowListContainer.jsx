import {connect} from 'react-redux';

import WorkflowList from '../../components/workflowGenerator/WorkflowList';

const WorkflowListContainer = connect(state => state.workflowGenerator_workflowReducer)(WorkflowList);

export default WorkflowListContainer;