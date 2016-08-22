import React from 'react';
import { Route, IndexRoute } from 'react-router';

import ComponentMapsPage from './pages/ComponentMapsPage';
import ComponentRegistryPage from './pages/ComponentRegistryPage';
import PluginMapsPage from './pages/PluginMapsPage';
import PluginRegistryPage from './pages/PluginRegistryPage';
import WorkflowGeneratorPage from './pages/WorkflowGeneratorPage';
import AppPage from './pages/AppPage';

export default (
  <Route path={location.pathname} component={AppPage}>
    <IndexRoute component={ComponentMapsPage} />
    <Route path="/componentRegistry" component={ComponentRegistryPage} />
    <Route path="/pluginMaps" component={PluginMapsPage} />
    <Route path="/pluginRegistry" component={PluginRegistryPage} />
    <Route path="/workflowGenerator" component={WorkflowGeneratorPage} />
  </Route>
);