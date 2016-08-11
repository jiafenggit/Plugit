import {
  FETCH_COMPONENT_MAPS,
  FETCH_COMPONENT_MAPS_SUCCESS,
  FETCH_COMPONENT_MAPS_FAIL,
  COMPONENT_MAPS_SELECT_RECEPTACLE,
  UPDATE_COMPONENT_MAP_SETTING_SUCCESS,
  CHANGE_COMPONENT_SUCCESS,
} from '../actions/componentMaps';

const INITIAL_STATE = {data: [], error: null, loading: false, activeIndex: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPONENT_MAPS:
      return Object.assign({}, state, {error: null, loading: true});
    case FETCH_COMPONENT_MAPS_SUCCESS:
    {
      let finalData = {};
      let activeIndex = null;
      action.payload.data.forEach((map, index) => {
        if (index === 0) activeIndex = [map.workflow, 0].join('/');
        if (!finalData[map.workflow]) finalData[map.workflow] = [map];
        else finalData[map.workflow].push(map);
      });
      return Object.assign({}, state, {error: null, data: finalData, loading: false, activeIndex});
    }
    case FETCH_COMPONENT_MAPS_FAIL:
      return Object.assign({}, state, {data: [], error: action.error.data, loading: false});
    case COMPONENT_MAPS_SELECT_RECEPTACLE:
      return Object.assign({}, state, {activeIndex: action.activeIndex});
    case UPDATE_COMPONENT_MAP_SETTING_SUCCESS:
    {
      const {group, workflow, receptacle} = action.meta.previousAction;
      const t = state.activeIndex.split('/');
      if (t[0] !== workflow) return state;
      const index = parseInt(t[1]);
      const componentMap = state.data[workflow][index];
      if (group !== componentMap.group || workflow !== componentMap.workflow || receptacle !== componentMap.receptacle) return state;
      let s = Object.assign({}, state);
      s.data[workflow][index] = action.payload.data;
      return s;
    }
    case CHANGE_COMPONENT_SUCCESS:
      const {group, workflow, receptacle} = action.meta.previousAction;
      if (!state.data[workflow]) return state;
      let data = Object.assign({}, state.data);
      data[workflow] = state.data[workflow].map(map => {
        if (map.group === group && map.workflow === workflow && map.receptacle === receptacle) {
          return action.payload.data;
        } else {
          return map;
        }
      });
      return Object.assign({}, state, {data});
    default:
      return state;
  }
}