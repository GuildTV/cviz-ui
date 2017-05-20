import React from 'react';
import { Route } from 'react-router';

import { EditScene, EditSceneList } from './components/EditScenes';
import { EditPlaylist, EditPlaylistList } from './components/EditPlaylists'
import Dashboard from './components/Dashboard';
import Playlist from './components/Playlist';

export default (
  <Route>
    <Route path="/edit/playlists" component={EditPlaylistList} />
    <Route path="/edit/playlists/:mode/:id" component={EditPlaylist} />
    <Route path="/edit/playlists/create" component={EditPlaylist} />
    <Route path="/scenes" component={EditSceneList} />
    <Route path="/scenes/:mode/:id" component={EditScene} />
    <Route path="/scenes/create" component={EditScene} />
    <Route path="/playlist" component={Playlist} />
    <Route path="/" component={Dashboard} />
  </Route>
);
