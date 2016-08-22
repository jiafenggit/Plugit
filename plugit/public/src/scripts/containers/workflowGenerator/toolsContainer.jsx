import {connect} from 'react-redux';

import Tools from '../../components/workflowGenerator/Tools';

const ToolsContainer = connect(state => state)(Tools);

export default ToolsContainer;