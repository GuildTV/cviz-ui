import thinky from '../thinky';

import { runTemplate, goTemplate, killTemplate } from './template';

let queuedId = "";

export function setup(Models, app, io){
  let { Scene } = Models;

  app.post('/playlist/next', function(req, res){
    Scene.orderBy({ index: thinky.r.asc("order") }).run().then(function(data){
      const index = data.findIndex(e => e.id == queuedId);
      const newIndex = index<0 ? 0 : (index == data.length-1 ? 0 : index+1);

      queuedId = data[newIndex].id;
      io.emit('getQueued', data[newIndex]);
      res.send(data[newIndex]);
    });
  });
  app.post('/playlist/previous', function(req, res){
    Scene.orderBy({ index: thinky.r.asc("order") }).run().then(function(data){
      const index = data.findIndex(e => e.id == queuedId);
      const newIndex = index<0 ? 0 : (index == 0 ? data.length-1 : index-1);

      queuedId = data[newIndex].id;
      io.emit('getQueued', data[newIndex]);
      res.send(data[newIndex]);
    });
  });

  app.post('/scene/go', function(req, res){
    goTemplate();
    io.emit('apiGoScene');
    res.send("OK");
  });
  app.post('/scene/kill', function(req, res){
    killTemplate();
    io.emit('apiKillScene');
    res.send("OK");
  });
  app.post('/scene/run', function(req, res){
    Scene.filter({id: queuedId}).run().then(function(data) {
      if(!data || data.length == 0)
        return res.send("No template selected");

      runTemplate(data[0]);
      io.emit('apiRunScene');
      res.send("OK");
    });
  });

}

export function bind(Models, socket){
  let { Scene } = Models;

  socket.on('getQueued', () => {
    Scene.filter({id: queuedId}).run().then(function(data) {
      if(!data || data.length == 0) {
        return Scene.orderBy({ index: thinky.r.asc("order") }).run().then(function(data){
          if(data && data.length != 0) {
            queuedId = data[0].id;
            console.log("Defaulted to queue scene:", data[0].name);

            socket.emit('getQueued', data[0]);
          }
        });
      }

      socket.emit('getQueued', data[0]);
    }).error(function(error) {
      console.log("Error getting queued: ", error)
    });
  });

}