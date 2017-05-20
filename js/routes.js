import React from 'react';
import { Route, Redirect } from 'react-router';

import { EditScene, EditSceneList } from './components/EditScenes';
import { EditPlaylist, EditPlaylistList } from './components/EditPlaylists';
import { EditChannel, EditChannelList } from './components/EditSettings';
import Dashboard from './components/Dashboard';

export default (
  <Route>
    <Route path="/edit/playlists" component={EditPlaylistList} />
    <Route path="/edit/playlists/:mode/:id" component={EditPlaylist} />
    <Route path="/edit/playlists/create" component={EditPlaylist} />
    <Route path="/edit/scenes" component={EditSceneList} />
    <Route path="/edit/scenes/:mode/:id" component={EditScene} />
    <Route path="/edit/scenes/create" component={EditScene} />
    <Route path="/edit/settings/:id" component={EditChannel} />
    <Route path="/edit/settings" component={EditChannelList} />
    <Route path="/dashboard/:id" component={Dashboard} />
    <Redirect path="/" to="/dashboard/1" />
  </Route>
);
