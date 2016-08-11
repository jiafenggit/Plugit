import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

const client = axios.create({ 
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/plugit' : '/plugit',
  timeout: 10000,
  responseType: 'json'
});
// Middleware you want to use in production:
const enhancer = applyMiddleware(axiosMiddleware(client));

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  return createStore(rootReducer, initialState, enhancer);
}