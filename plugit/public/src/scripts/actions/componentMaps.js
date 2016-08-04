import axios from 'axios';

// Get componentMapList
export const FETCH_COMPONENT_MAPS = 'FETCH_COMPONENT_MAPS';
export const FETCH_COMPONENT_MAPS_SUCCESS = 'FETCH_COMPONENT_MAPS_SUCCESS';
export const FETCH_COMPONENT_MAPS_FAILURE = 'FETCH_COMPONENT_MAPS_FAILURE';
export const RESET_COMPONENT_MAPS = 'RESET_COMPONENT_MAPS';

axios.defaults.baseURL = 'http://localhost:3000/plugit';
axios.defaults.timeout = 10000;

export function fetchComponentMaps() {
  return {
    type: FETCH_COMPONENT_MAPS,
    payload: axios({
      method: 'get',
      url: '/map/components'
    })
  };
}

export function fetchComponentMapsSuccess(componentMaps) {
  return {
    type: FETCH_COMPONENT_MAPS_SUCCESS,
    payload: componentMaps
  };
}

export function fetchComponentMapsFailure(error) {
  return {
    type: FETCH_COMPONENT_MAPS_FAILURE,
    payload: error
  };
}