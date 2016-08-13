/**
 * Created by miserylee on 16/8/12.
 */
import axiosMiddleware, {getActionTypes} from 'redux-axios-middleware';
import axios from 'axios';

const client = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/plugit' : '/plugit',
  timeout: 10000,
  responseType: 'json'
});

client.interceptors.request.use(function (config) {
  config.headers['Authorization'] = `Bearer ${localStorage.getItem('jwt')}`;
  return config;
});

export default axiosMiddleware(client, {
  onError: ({ action, next, error }, options) => {
    let errorObject;
    if (!error.response) {
      errorObject = {
        data: error.message,
        status: 0
      };
      if (process.env.NODE_ENV !== 'production') {
        console.log('HTTP Failure in Axios', error);
      }
    } else {
      errorObject = {
        data: error.response.data.error
      };
    }
    const nextAction = {
      type: getActionTypes(action, options)[2],
      error: errorObject,
      meta: {
        previousAction: action
      }
    };

    next(nextAction);
    return nextAction;
  }
});