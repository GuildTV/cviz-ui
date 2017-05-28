"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

import { webui_port } from "./config";

import sceneSetup from './controllers/scene';
import settingsSetup from './controllers/settings';
import { setup as templateSetup, bind as templateBind } from './controllers/template';
import playlistSetup from './controllers/playlist';

import Models from "./models";

const app = express();

// Run server to listen on port 3000.
const server = app.listen(webui_port, () => {
  console.log(`listening on *:${webui_port}`);
});

const io = require('socket.io')(server);

// Setup nunjucks templating engine
nunjucks.configure(app.get('views'), {
    noCache: true,
    watch: true,
    express: app
});

const channelState = [];

app.use(bodyParser.urlencoded({ extended: false } ));
app.use(bodyParser.json());
app.use(express.static('static'));
app.engine( 'html', nunjucks.render );

templateSetup(Models, channelState);
sceneSetup(Models, channelState, app);
playlistSetup(Models, channelState, app);
settingsSetup(Models, channelState, app);

// Set socket.io listeners.
io.sockets.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  templateBind(Models, channelState, socket);
});

const scriptSrc = (process.env.NODE_ENV == "production") ? "app.js" : "http://localhost:8087/static/app.js";

// Set Express routes.
app.get('/', (req, res) => {
  res.render(__dirname + '/views/index.html', { scriptSrc: scriptSrc });
});
