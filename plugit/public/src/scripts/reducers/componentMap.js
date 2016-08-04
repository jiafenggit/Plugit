import {FETCH_COMPONENT_MAPS, FETCH_COMPONENT_MAPS_SUCCESS, FETCH_COMPONENT_MAPS_FAILURE, RESET_COMPONENT_MAPS} from '../actions/componentMaps';

const INITIAL_STATE = { componentMaps: [], error: null, loading: false };


export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPONENT_MAPS:
      return { componentMaps: [], error: null, loading: true };
    case FETCH_COMPONENT_MAPS_SUCCESS:
      return { componentMaps: action.payload.data, error: null, loading: false };
    case FETCH_COMPONENT_MAPS_FAILURE:
      return { componentMaps: [], error: action.payload.data || { message: action.payload.message }, loading: false };
    case RESET_COMPONENT_MAPS:
      return { componentMaps: [], error: null, loading: false };
    default:
      return state;
  }
}