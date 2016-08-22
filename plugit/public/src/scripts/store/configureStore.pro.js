import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import axiosMiddleware from './axiosMiddleware';
import {persistStore, autoRehydrate} from 'redux-persist';

// Middleware you want to use in production:
const enhancer = applyMiddleware(axiosMiddleware, autoRehydrate());

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store);
  return store;
}