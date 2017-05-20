
let playlists = [
  {
    id: 1,
    nextPos: 0, // next item in the playlist
  }
];

function returnPlaylist(pl, playlist){
  const length = playlist.PlaylistEntries.length;
  const nextPos = pl.nextPos >= length ? 0 : pl.nextPos;

  const nextScene = playlist.PlaylistEntries[nextPos] || null;

  return {
    id: pl.id,
    nextScene: nextScene !== null ? nextScene.Scene : null,
    nextPos: nextPos,
    length: length,
  };
}

function loadPlaylist(Models, id){
  const { Scene, Playlist, PlaylistEntry } = Models;

  const pl = playlists[id];
  if (pl === undefined || pl === null)
    return Promise.reject(404);

  return Playlist.findById(pl.id, {
    include: [ {
      model: PlaylistEntry,
      include: Scene
    } ]
  }).then(playlist => {
    if (!playlist)
      return Promise.reject(404);

    return { playlist, pl };
  });
}

export default function(Models, app){
  let { Scene, Playlist, PlaylistEntry, sequelize } = Models;

  // run api
  app.get('/api/channel/:id', (req, res) => {
    loadPlaylist(Models, req.params.id).then(({playlist, pl}) => {
      res.send(returnPlaylist(pl, playlist));

    }).catch(() => res.status(500).send(""));
  });
  app.post('/api/channel/:id/next', function(req, res){
    loadPlaylist(Models, req.params.id).then(({playlist, pl}) => {
      pl.nextPos++;
      if (pl.nextPos >= playlist.PlaylistEntries.length)
        pl.nextPos = 0;

      res.send(returnPlaylist(pl, playlist));

    }).catch(() => res.status(500).send(""));
  });
  app.post('/api/channel/:id/previous', function(req, res){
    loadPlaylist(Models, req.params.id).then(({playlist, pl}) => {
      pl.nextPos--;
      if (pl.nextPos < 0)
        pl.nextPos = playlist.PlaylistEntries.length-1;

      res.send(returnPlaylist(pl, playlist));

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
