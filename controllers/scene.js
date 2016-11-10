import mapSeries from 'promise-map-series';

export function setup(Models, app){
  let { Scene, SceneData } = Models;

  app.get('/api/scenes', (req, res) => {
    Scene.findAll({
      include: [ SceneData ]
    }).then(scenes => res.send(scenes));
  });
  app.get('/api/scenes/:id', (req, res) => {
    if (!req.params.id)
      return res.status(404).send("");

    Scene.findById(req.params.id, {
      include: [ SceneData ]
    }).then(scene => {
      if (!scene)
        return res.status(404).send("");

      res.send(scene);
    })
    .catch(err => res.status(500).send(err));
  });
  app.delete('/api/scenes/:id', (req, res) => {
    if (!req.params.id)
      return res.status(404).send("");

    Scene.destroy({
      where: {
        id: req.params.id
      }
    })
    .catch(err => res.status(500).send(err));

    res.send("");
  });

}

export function bind(Models, socket){
  const { Scene, SceneData, sequelize } = Models;

  socket.on('updateScene', (data) => {
    console.log("Save Scene: ", data.id);

    if (data.id){
      return Scene.findById(data.id, {
        include: [ SceneData ]
      }).then(scene => {
        return sequelize.transaction(function (t) {
          const got = scene.SceneData || [];
          const newOnes = data.SceneData.filter(d => got.findIndex(e => e.name == d.name) < 0);
          const existingOnes = data.SceneData.filter(d => got.findIndex(e => e.name == d.name) >= 0);

          const newData = newOnes.map(d => {
            delete d.id;
            d.SceneId = data.id;

            return d;
          });

          const names = newData.map(n => n.name).concat(existingOnes.map(n => n.name));

          return SceneData.bulkCreate(newData, { transaction: t }).then(() => {
            return mapSeries(existingOnes, d => {
              delete d.id;
              d.SceneId = data.id;
              return SceneData.update(d, {
                where: {
                  SceneId: data.id,
                  name: d.name
                },
                transaction: t
              });
            }).then(() => {
              return SceneData.destroy({
                where: {
                  SceneId: data.id,
                  name: { $notIn: names }
                },
                transaction: t
              });
            });
          }).then(() => {
            Object.assign(scene, data);
            return scene.save();
          });
        });
      }).then(() => {
        return Scene.findById(data.id, { 
          include: [ SceneData ]
        }).then(scene => socket.emit('updateScene', [ scene ]));
      }).catch(error => console.log("Error updating scene:", error));
    }

    return Scene.create(data, {
      include: SceneData
    }).then(res => {
      console.log("Scene added to DB: ", res);

      socket.emit('updateScene', [ res ]);
    }).catch(err => console.log("Error saving new scene:", err));
  });


}
