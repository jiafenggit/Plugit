import { connect } from 'react-redux';
import { fetchComponentMaps, fetchComponentMapsSuccess, fetchComponentMapsFailure } from '../actions/componentMaps.js';

import ComponentMapList from '../components/ComponentMapList';


const mapStateToProps = (state) => {
  return state.componentMap;
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComponentMaps: () => {
      dispatch(fetchComponentMaps()).then((response) => {
        !response.error ? dispatch(fetchComponentMapsSuccess(response.payload)) : dispatch(fetchComponentMapsFailure(response.payload));
      });
    }
  };
};


const ComponentMapListContainer = connect(mapStateToProps, mapDispatchToProps)(ComponentMapList);

export default ComponentMapListContainer;