import '../less/common.less';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import routes from './routes';
import configureStore from './store/configureStore.js';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = configureStore();

window.onload = _ => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={hashHistory} routes={routes} />
    </Provider>,
    document.getElementById('app')
  );
};