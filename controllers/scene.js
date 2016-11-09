import mapSeries from 'promise-map-series';

export function setup(Models, app){
  let { Scene, SceneData } = Models;

  app.get('/api/scenes', (req, res) => {
    Scene.findAll({
      include: [ SceneData ]
    }).then(scenes => res.send(scenes));
  });
  // app.post('/playlist/previous', function(req, res){
  //   Scene.orderBy({ index: thinky.r.asc("order") }).run().then(function(data){
  //     const index = data.findIndex(e => e.id == queuedId);
  //     const newIndex = index<0 ? 0 : (index == 0 ? data.length-1 : index-1);

  //     queuedId = data[newIndex].id;
  //     io.emit('getQueued', data[newIndex]);
  //     res.send(data[newIndex]);
  //   });
  // });

  // app.post('/scene/go', function(req, res){
  //   goTemplate();
  //   io.emit('apiGoScene');
  //   res.send("OK");
  // });
  // app.post('/scene/kill', function(req, res){
  //   killTemplate();
  //   io.emit('apiKillScene');
  //   res.send("OK");
  // });
  // app.post('/scene/run', function(req, res){
  //   Scene.filter({id: queuedId}).run().then(function(data) {
  //     if(!data || data.length == 0)
  //       return res.send("No template selected");

  //     const compiled = {
  //       data: data[0],
  //       template: data[0].template,
  //       dataId: data[0].name
  //     };

  //     runTemplate(compiled);
  //     io.emit('apiRunScene');
  //     res.send("OK");
  //   });
  // });

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

  socket.on('getScenes', () => {
    Scene.findAll({
      include: [ SceneData ]
    }).then(data => {
      socket.emit('getScenes', data);
    }).catch(error => console.log("Error getting people:", error));
  });

  socket.on('deleteScene', (data) => {
    Scene.findById(data.id).then(data => {
      return data.destroy().then(() => socket.emit('deleteScene', data.id));
    }).catch(error => console.log("Error deleting scene:", error));
  });

}
