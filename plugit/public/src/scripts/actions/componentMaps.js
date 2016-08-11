import axios from 'axios';

// Get componentMapList
export const FETCH_COMPONENT_MAPS = 'FETCH_COMPONENT_MAPS';
export const FETCH_COMPONENT_MAPS_SUCCESS = 'FETCH_COMPONENT_MAPS_SUCCESS';
export const FETCH_COMPONENT_MAPS_FAIL = 'FETCH_COMPONENT_MAPS_FAIL';

export const COMPONENT_MAPS_SELECT_RECEPTACLE = 'COMPONENT_MAPS_SELECT_RECEPTACLE';

export const UPDATE_COMPONENT_MAP_SETTING = 'UPDATE_COMPONENT_MAP_SETTING';
export const UPDATE_COMPONENT_MAP_SETTING_SUCCESS = 'UPDATE_COMPONENT_MAP_SETTING_SUCCESS';
export const UPDATE_COMPONENT_MAP_SETTING_FAIL = 'UPDATE_COMPONENT_MAP_SETTING_FAIL';

export const CHANGE_COMPONENT = 'CHANGE_COMPONENT';
export const CHANGE_COMPONENT_SUCCESS = 'CHANGE_COMPONENT_SUCCESS';
export const CHANGE_COMPONENT_FAIL = 'CHANGE_COMPONENT_FAIL';

export function fetchComponentMaps(group) {
  return {
    type: FETCH_COMPONENT_MAPS,
    payload: {
      request: {
        method: 'get',
        url: `/map/components/groups/${group}`
      }
    }
  };
}

export function componentMapsSelectReceptacle(index) {
  return {
    type: COMPONENT_MAPS_SELECT_RECEPTACLE,
    activeIndex: index
  };
}

export function updateComponentMapSetting(group, workflow, receptacle, key, value) {
  return {
    type: UPDATE_COMPONENT_MAP_SETTING,
    key,
    group,
    workflow,
    receptacle,
    payload: {
      request: {
        method: 'put',
        url: `/map/components/groups/${group}/workflows/${workflow}/receptacles/${receptacle}/settings/${key}`,
        data: {value}
      }
    }
  };
}

export function changeComponent(group, workflow, receptacle, name) {
  return {
    type: CHANGE_COMPONENT,
    group,
    workflow,
    receptacle,
    payload: {
      request: {
        method: 'put',
        url: `/map/components/groups/${group}/workflows/${workflow}/receptacles/${receptacle}/name`,
        data: {name}
      }
    }
  };
}