import mapSeries from 'promise-map-series';

export default function(Models, socket){
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
            d.id = undefined;
            d.SceneId = data.id;

            return d;
          });

          const names = newData.map(n => n.name).concat(existingOnes.map(n => n.name));

          return SceneData.bulkCreate(newData, { transaction: t }).then(() => {
            return mapSeries(existingOnes, d => {
              d.id = undefined;
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
