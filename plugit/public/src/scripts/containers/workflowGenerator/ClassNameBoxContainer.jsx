import {connect} from 'react-redux';

import ClassNameBox from '../../components/workflowGenerator/ClassNameBox';

const ClassNameBoxContainer = connect(state => state.workflowGenerator_classNameReducer)(ClassNameBox);

export default ClassNameBoxContainer;