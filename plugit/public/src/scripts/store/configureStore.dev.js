import { createStore, applyMiddleware, compose } from 'redux';
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import reducer from '../reducers';

const client = axios.create({ 
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:4000/plugit' : '/plugit',
  timeout: 10000,
  responseType: 'json'
});

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(axiosMiddleware(client)),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}