import mapSeries from 'promise-map-series';

export default function(Models, channelState, app){
  let { Scene, SceneData, sequelize } = Models;

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
  app.post('/api/scenes/bulk-delete', (req, res) => {
    if (!req.body.ids)
      return res.status(404).send("");

    Scene.destroy({
      where: {
        id: { $in: req.body.ids }
      }
    })
    .then(() => {
      Scene.findAll({
        include: [ SceneData ]
      }).then(scenes => res.send(scenes));
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

  app.put('/api/scenes', (req, res) => {
    Scene.create(req.body, {
      include: SceneData
    }).then(dat => {
      console.log("Scene added to DB: ", req.body);

      res.send(dat);
    }).catch(err => {
      console.log("Error saving new scene:", err);
      res.status(500).send(err);
    });
  });

  app.post('/api/scenes/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;

    Scene.findById(id, {
      include: [ SceneData ]
    }).then(scene => {
      return sequelize.transaction(function (t) {
        const got = scene.SceneData || [];
        const newOnes = data.SceneData.filter(d => got.findIndex(e => e.name == d.name) < 0);
        const existingOnes = data.SceneData.filter(d => got.findIndex(e => e.name == d.name) >= 0);

        const newData = newOnes.map(d => {
          delete d.id;
          d.SceneId = id;

          return d;
        });

        const names = newData.map(n => n.name).concat(existingOnes.map(n => n.name));

        return SceneData.bulkCreate(newData, { transaction: t }).then(() => {
          return mapSeries(existingOnes, d => {
            delete d.id;
            d.SceneId = id;
            return SceneData.update(d, {
              where: {
                SceneId: id,
                name: d.name
              },
              transaction: t
            });
          }).then(() => {
            return SceneData.destroy({
              where: {
                SceneId: id,
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
      return Scene.findById(id, { 
        include: [ SceneData ]
      }).then(scene => {
        console.log("Updated scene:", id);
        res.send(scene);
      });
    }).catch(error => {
      res.status(500).send(error);
      console.log("Error updating scene:", error);
    });
  });
}
