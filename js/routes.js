import React from 'react';
import { Route } from 'react-router';

import EditScenes from './components/EditScenes';
import Dashboard from './components/Dashboard';
import Playlist from './components/Playlist';

export default (
  <Route>
    <Route path="/scenes" component={EditScenes} />
    <Route path="/playlist" component={Playlist} />
    <Route path="/" component={Dashboard} />
  </Route>
);
