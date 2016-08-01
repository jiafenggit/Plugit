import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import CounterApp from './containers/CounterApp';
import configureStore from './store/configureStore';

const store = configureStore();

render(
  <Provider store={store}>
    <CounterApp />
  </Provider>,
  document.getElementById('app')
);