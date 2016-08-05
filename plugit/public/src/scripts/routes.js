import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ComponentMapListPage from './pages/ComponentMapListPage';
import AppPage from './pages/AppPage';

export default (
  <Route path={location.pathname} component={AppPage}>
    <IndexRoute component={ComponentMapListPage} />
  </Route>
);