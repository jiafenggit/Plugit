import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../reducers';
import axiosMiddleware from './axiosMiddleware';

export default function configureStore(initialState) {
  const finalCreateStore = compose(
    applyMiddleware(axiosMiddleware),
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