/**
 * Created by miserylee on 16/8/10.
 */
import {FETCH_COMPONENTS_BY_TYPE, FETCH_COMPONENTS_BY_TYPE_SUCCESS, FETCH_COMPONENTS_BY_TYPE_FAIL, SHOW_COMPONENTS_BY_TYPE, HIDE_COMPONENTS_BY_TYPE} from '../actions/component';

const INITIAL_STATE = {data: [], error: null, loading: false};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case FETCH_COMPONENTS_BY_TYPE:
      return Object.assign({}, state, {error: null, loading: true});
    case FETCH_COMPONENTS_BY_TYPE_SUCCESS:
      return Object.assign({}, state, {error: null, loading: false, data: action.payload.data});
    case FETCH_COMPONENTS_BY_TYPE_FAIL:
      return Object.assign({}, state, {error: action.error.data, loading: false, data: null});
    default:
      return state;
  }
}