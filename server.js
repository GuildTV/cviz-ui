"use strict";
const express = require('express');
const bodyParser = require('body-parser');

import { webui_port } from "./config";

import sceneController from './controllers/scene';
import templateController from './controllers/template';
// import { setup as queueSetup, bind as queueBind } from './controllers/queued';

import Models from "./models";

const app = express();

// Run server to listen on port 3000.
const server = app.listen(webui_port, () => {
  console.log(`listening on *:${webui_port}`);
});

const io = require('socket.io')(server);

app.use(bodyParser.urlencoded({ extended: false } ));
app.use(express.static('static'));

// queueSetup(Models, app, io);

// Set socket.io listeners.
io.sockets.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  sceneController(Models, socket);

  templateController(Models, socket);
  // queueBind(Models, socket);
});

// Set Express routes.
app.get('/', (req, res) => {
  if(process.env.NODE_ENV == "production")
    res.sendFile(__dirname + '/views/index.html');
  else
    res.sendFile(__dirname + '/views/dev.html');
});
