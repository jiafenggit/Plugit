import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ComponentMapsPage from './pages/ComponentMapsPage';
import AppPage from './pages/AppPage';

export default (
  <Route path={location.pathname} component={AppPage}>
    <IndexRoute component={ComponentMapsPage} />
  </Route>
);