import React from 'react';
import { Route } from 'react-router';

import { EditScene, EditSceneList } from './components/EditScenes';
import Dashboard from './components/Dashboard';
import Playlist from './components/Playlist';

export default (
  <Route>
    <Route path="/scenes" component={EditSceneList} />
    <Route path="/scenes/edit/:data" component={EditScene} />
    <Route path="/playlist" component={Playlist} />
    <Route path="/" component={Dashboard} />
  </Route>
);
