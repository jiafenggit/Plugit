import {FETCH_COMPONENT, FETCH_COMPONENT_SUCCESS, FETCH_COMPONENT_FAIL} from '../../actions/component';
import {
  UPDATE_COMPONENT_MAP_SETTING,
  UPDATE_COMPONENT_MAP_SETTING_FAIL,
  UPDATE_COMPONENT_MAP_SETTING_SUCCESS
} from '../../actions/componentMaps';
import {COMPONENT_MAPS_SELECT_RECEPTACLE} from '../../actions/componentMaps';

const INITIAL_STATE = {data: null, error: null, loading: false, updatingSettings: {}, updateSettingErrors: {}};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case COMPONENT_MAPS_SELECT_RECEPTACLE:
      return Object.assign({}, state);
    case FETCH_COMPONENT:
      return Object.assign({}, state, {error: null, loading: true, updatingSettings: {}, updateSettingErrors: {}});
    case FETCH_COMPONENT_SUCCESS:
      return Object.assign({}, state, {error: null, data: action.payload.data, loading: false});
    case FETCH_COMPONENT_FAIL:
      return Object.assign({}, state, {data: null, error: action.error.data, loading: false});
    case UPDATE_COMPONENT_MAP_SETTING:
    {
      state.updatingSettings[action.key] = true;
      state.updateSettingErrors[action.key] = null;
      return Object.assign({}, state, {
        updatingSettings: Object.assign({}, state.updatingSettings),
        updateSettingErrors: Object.assign({}, state.updateSettingErrors)
      });
    }
    case UPDATE_COMPONENT_MAP_SETTING_SUCCESS:
    {
      const key = action.meta.previousAction.key;
      if (state.updatingSettings[key] === undefined) return state;
      state.updatingSettings[key] = false;
      state.updateSettingErrors[key] = null;
      return Object.assign({}, state, {
        updatingSettings: Object.assign({}, state.updatingSettings),
        updateSettingErrors: Object.assign({}, state.updateSettingErrors)
      });

    }
    case UPDATE_COMPONENT_MAP_SETTING_FAIL:
    {
      const key = action.meta.previousAction.key;
      if (state.updatingSettings[key] === undefined) return state;
      state.updatingSettings[key] = false;
      state.updateSettingErrors[key] = action.error.data;
      return Object.assign({}, state, {
        updatingSettings: Object.assign({}, state.updatingSettings),
        updateSettingErrors: Object.assign({}, state.updateSettingErrors)
      });

    }
    default:
      return state;
  }
}