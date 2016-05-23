import React from 'react';
import { IndexRoute, Route } from 'react-router';

import EditScenes from './components/EditScenes';
import Dashboard from './components/Dashboard';

export default (
  <Route>
    <Route path="/scenes" component={EditScenes} />
    <Route path="/" component={Dashboard} />
  </Route>
);
