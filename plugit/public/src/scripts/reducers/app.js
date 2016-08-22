/**
 * Created by miserylee on 16/8/12.
 */
import {UNAUTHORIZED, LOGIN, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CHECK_AUTH, CHECK_AUTH_FAIL, CHECK_AUTH_SUCCESS} from '../actions/app';

import {REHYDRATE} from 'redux-persist/constants';

const INITIAL_STATE = {isLogged: false, loading: false, error: null, data: null};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case REHYDRATE:
    {
      return Object.assign({}, state);
    }
    case UNAUTHORIZED:
    case LOGOUT:
    case CHECK_AUTH_FAIL:
    case CHECK_AUTH:
      return {isLogged: false, loading: false, error: null, data: null};
    case LOGIN:
      return {isLogged: false, loading: true, error: null, data: null};
    case LOGIN_SUCCESS:
    case CHECK_AUTH_SUCCESS:
      return {isLogged: true, loading: false, error: null, data: action.payload.data};
    case LOGIN_FAIL:
      return {isLogged: false, loading: false, error: action.error.data, data: null};
    default:
      return state;
  }
}