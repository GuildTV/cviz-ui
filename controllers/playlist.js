
function returnPlaylist(state, playlist){
  const length = playlist.PlaylistEntries.length;
  const nextPos = state.playlistNextPos >= length ? 0 : state.playlistNextPos;

  const nextScene = playlist.PlaylistEntries[nextPos] || null;

  return {
    id: state.playlistId,
    nextScene: nextScene !== null ? nextScene.Scene : null,
    nextPos: nextPos,
    length: length,
  };
}

function loadPlaylist(Models, channelState, id){
  const { Scene, SceneData, Playlist, PlaylistEntry } = Models;

  const ch = channelState.findChannel(id);
  if (!ch)
    return Promise.reject(404);

  return Playlist.findById(ch.state().playlistId, {
    include: [ {
      model: PlaylistEntry,
      include: [ {
        model: Scene,
        include: SceneData
      } ]
    } ]
  }).then(playlist => {
    if (!playlist)
      return Promise.reject(404);

    return { playlist, ch };
  });
}

export default function(Models, channelState, app){
  let { Scene, Playlist, PlaylistEntry, sequelize } = Models;

  // run api
  app.get('/api/channel/:id', (req, res) => {
    loadPlaylist(Models, channelState, req.params.id).then(({playlist, ch}) => {
      res.send(returnPlaylist(ch.state(), playlist));

    }).catch(() => res.status(500).send(""));
  });
  app.post('/api/channel/:id/next', function(req, res){
    loadPlaylist(Models, channelState, req.params.id).then(({playlist, ch}) => {
      let pos = ch.state().playlistNextPos+1;
      if (pos >= playlist.PlaylistEntries.length)
        pos = 0;

      ch.setProps({ playlistNextPos: pos})

      res.send(returnPlaylist(ch.state(), playlist));

    }).catch(() => res.status(500).send(""));
  });
  app.post('/api/channel/:id/previous', function(req, res){
    loadPlaylist(Models, channelState, req.params.id).then(({playlist, ch}) => {
      let pos = ch.state().playlistNextPos-1;
      if (pos < 0)
        pos = playlist.PlaylistEntries.length-1;

      ch.setProps({ playlistNextPos: pos})

      res.send(returnPlaylist(ch.state(), playlist));

    }).catch(() => res.status(500).send(""));
  });

  // admin api
  app.get('/api/playlists', (req, res) => {
    Playlist.findAll({
      include: [ {
        model: PlaylistEntry,
        include: Scene
      } ]
    }).then(playlists => res.send(playlists));
  });
  app.get('/api/playlists/:id', (req, res) => {
    if (!req.params.id)
      return res.status(404).send("");

    Playlist.findById(req.params.id, {
      include: [ {
        model: PlaylistEntry,
        include: Scene
      } ]
    }).then(playlist => {
      if (!playlist)
        return res.status(404).send("");

      res.send(playlist);
    })
    .catch(err => res.status(500).send(err));
  });
  app.post('/api/playlists/bulk-delete', (req, res) => {
    if (!req.body.ids)
      return res.status(404).send("");

    Playlist.destroy({
      where: {
        id: { $in: req.body.ids }
      }
    })
    .then(() => {
      Playlist.findAll({
        include: [ {
          model: PlaylistEntry,
          include: Scene
        } ]
      }).then(playlists => res.send(playlists));
    })
    .catch(err => res.status(500).send(err));
  });
  app.delete('/api/playlists/:id', (req, res) => {
    if (!req.params.id)
      return res.status(404).send("");

    Playlist.destroy({
      where: {
        id: req.params.id
      }
    })
    .catch(err => res.status(500).send(err));

    res.send("");
  });

  app.put('/api/playlists', (req, res) => {
    const data = {
      name: req.body.name,
      PlaylistEntries: []
    };

    if (req.body.scenes){
      for(let i in req.body.scenes) {
        data.PlaylistEntries.push({
          SceneId: req.body.scenes[i],
          order: i,
        });
      }
    }

    Playlist.create(data, {
      include: [ {
        model: PlaylistEntry,
        include: Scene
      } ]
    }).then(dat => {
      console.log("Playlist added to DB: ", data);

      res.send(dat);
    }).catch(err => {
      console.log("Error saving new Playlist:", err);
      res.status(500).send(err);
    });
  });

  app.post('/api/playlists/:id', (req, res) => {
    const id = req.params.id;

    Playlist.findById(id).then(playlist => {
      return sequelize.transaction(function (t) {
        return PlaylistEntry.destroy({
          where: {
            PlaylistId: id,
          },
          transaction: t
        }).then(() => {
          if (!req.body.scenes)
            return playlist.save();

          const newData = [];
          for(let i in req.body.scenes) {
            newData.push({
              PlaylistId: id,
              SceneId: req.body.scenes[i],
              order: i,
            });
          }

          return PlaylistEntry.bulkCreate(newData, { transaction: t });
        }).then(() => {
          return Playlist.update({
            name: req.body.name
          }, {
            where: {
              id: id,
            },
            transaction: t
          });
        });
      });
    }).then(() => {
      return Playlist.findById(id, { 
        include: [ {
          model: PlaylistEntry,
          include: Scene
        } ]
      }).then(playlist => {
        console.log("Updated playlist:", id);
        res.send(playlist);
      });
    }).catch(error => {
      res.status(500).send(error);
      console.log("Error updating playlist:", error);
    });
  });
}
