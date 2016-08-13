import { connect } from 'react-redux';

import App from '../components/App';

const AppContainer = connect(state => state.appReducer)(App);

export default AppContainer;