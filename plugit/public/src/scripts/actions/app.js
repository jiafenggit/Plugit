/**
 * Created by miserylee on 16/8/12.
 */
export const UNAUTHORIZED = 'UNAUTHORIZED';
export const LOGIN = 'LOGIN';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT = 'LOGOUT';
export const CHECK_AUTH = 'CHECK_AUTH';
export const CHECK_AUTH_SUCCESS = 'CHECK_AUTH_SUCCESS';
export const CHECK_AUTH_FAIL = 'CHECK_AUTH_FAIL';

import md5 from 'md5';

export function unauthorized() {
  return {
    type: UNAUTHORIZED
  };
}

export function login(username, password) {
  return {
    type: LOGIN,
    payload: {
      request: {
        method: 'post',
        url: `/login`,
        data: {username, password: md5(password)}
      }
    }
  };
}

export function logout() {
  return {
    type: LOGOUT
  };
}

export function checkAuth() {
  return {
    type: CHECK_AUTH,
    payload: {
      request: {
        method: 'get',
        url: `/auth`
      }
    }
  };
}