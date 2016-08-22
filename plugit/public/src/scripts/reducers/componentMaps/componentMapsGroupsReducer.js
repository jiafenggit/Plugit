import { FETCH_COMPONENT_MAPS_GROUPS, FETCH_COMPONENT_MAPS_GROUPS_SUCCESS, FETCH_COMPONENT_MAPS_GROUPS_FAIL, COMPONENT_MAPS_SELECT_GROUP } from '../../actions/componentMapsGroups';

const INITIAL_STATE = { data: [], error: null, loading: false, activeIndex: 0 };

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPONENT_MAPS_GROUPS:
      return Object.assign({}, state, { error: null, loading: true });
    case FETCH_COMPONENT_MAPS_GROUPS_SUCCESS:
      return Object.assign({}, state, { error: null, data: action.payload.data, loading: false });
    case FETCH_COMPONENT_MAPS_GROUPS_FAIL:
      return Object.assign({}, state, { data: [], error: action.error.data, loading: false });
    case COMPONENT_MAPS_SELECT_GROUP: {
      return Object.assign({}, state, { activeIndex: action.activeIndex });
    }
    default:
      return state;
  }
}