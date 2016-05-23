export default function(Models, socket){
  let { Scene } = Models;

  socket.on('updateScene', (data) => {
    console.log("Save Scene: ", data.uid);

    if(data.id)
      return Scene.filter({id: data.id}).run().then(function(scenes){
        if(scenes.length == 0)
          return console.log("Error loading scene: " + data.id);

        let scene = scenes[0]
        scene.merge(data);

        scene.save().then(function(doc) {
          console.log("Scene added to DB: ", doc);

          // we need to send the position too, so data needs reloading
          Scene.getJoin({position: true}).filter({id: doc.id}).run().then(function(scenes){
            socket.emit('updateScene', scenes);
          });
        }).error(function(error){
          console.log("Error saving new scene: ", error);
        });
      });

    return Scene.save(data).then(function(doc) {
      console.log("Scene added to DB: ", doc);

      // we need to send the position too, so data needs reloading
      Scene.getJoin({position: true}).filter({id: doc.id}).run().then(function(people){
        socket.emit('updateScene', people);
      });

    }).error(function(error){
        console.log("Error saving new person: ", error);
    });
  });

  socket.on('getScenes', () => {
    Scene.getJoin({position: true}).run().then(function(data) {
      socket.emit('getScenes', data);
    }).error(function(error) {
      console.log("Error getting people: ", error)
    });
  });

}
