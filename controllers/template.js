import net from 'net';
import fs from 'fs';

import { cvizHosts } from "../config";
import { saveState } from './util';

import JSONStream from 'JSONStream';

let pingInterval = null;

const clients = {};

export function setup(Models, channelState){
  let oldState = {};
  try {
    oldState = JSON.parse(fs.readFileSync("state.json"));

  } catch (e){
    console.log(e);
  }
  
  for(let conf of cvizHosts){
    clients[conf.id] = createClient(conf);
    const newS = {
      id: conf.id,
      mode: 'scene', // or playlist
      playlistId: 0,
      playlistNextPos: 0, // next item in the playlist
    };
    channelState.push(newS);

    const oldS = oldState[conf.id];
    if (oldS){
      Object.assign(newS, oldS);
    }
  }

  function writeLog(conf, msg){
    console.log("cviz " + conf.id + ": " + msg);
  }

  function createClient(conf) {
    const client = {
      pingInterval: null,
      lastState: {},
    };

    const sock = client.socket = new net.Socket();
    sock.setNoDelay(true);
    sock.setTimeout(500);

    sock.on('error', () => {
      writeLog(conf, "lost connection");

      sock.destroy();
      sock.unref();
      sock.connect(conf.port, conf.host, () => {
        writeLog(conf, "reconnected");
      });
    });

    sock.connect(conf.port, conf.host, function() {
      writeLog(conf, 'Connected');

      client.pingInterval = setInterval(() => {
        sock.write("{}");
      }, 300);
    });

    sock.pipe(JSONStream.parse()).on('data', (data) => {
      try {
        if(data == "{}")
          return;

        client.lastState = data;
        // writeLog(conf, "Received", data);
      } catch (e){
        writeLog(conf, "read error:", e);
      }
    });

    sock.on('close', () => {
      writeLog(conf, "Server has gone away!");
      if(client.pingInterval != null){
        clearInterval(client.pingInterval);
        client.pingInterval = null;
      }
    });

    return client;
  }
}

export function bind(Models, channelState, socket){
  const lastSentState = {};

  for(let k of Object.keys(clients)){
    const lS = clients[k].lastState;

    socket.emit('templateState', Object.assign({ id: k }, lS))
    
    clients[k].socket.pipe(JSONStream.parse()).on('data', (data) => {
      try {
        const stringData = JSON.stringify(data);
        if (lastSentState[k] == stringData || stringData == "{}")
          return;
        lastSentState[k] = stringData;
        data.id = k;

        socket.emit('templateState', data);
      } catch (e){
        console.log("CViz read error:", e);
      }
    });
  }

  socket.on('runTemplate', runTemplate);

  socket.on('templateGo', goTemplate);

  socket.on('templateKill', killTemplate);
}

export function runTemplate (data){
  console.log("runTemplate", data);

  // not pretty, but data needs to be passed as an object of strings
  const parameters = {};

  for(let k in data.data.SceneData) {
    const d = data.data.SceneData[k];

    parameters[d.name] = d.value;
  }

  const client = clients[data.id];
  if (!client)
    return console.log("run bad id:", data.id)

  client.socket.write(JSON.stringify({
    type: "LOAD",
    timelineFile: data.template,
    instanceName: data.dataId,
    parameters: parameters,
  }));
}

export function goTemplate (){
  console.log("templateGo");

  const client = clients[data.id];
  if (!client)
    return console.log("run bad id:", data.id)

  client.socket.write(JSON.stringify({
    type: "CUE"
  }));
}

export function killTemplate(){
  console.log("templateKill");

  const client = clients[data.id];
  if (!client)
    return console.log("run bad id:", data.id)

  client.socket.write(JSON.stringify({
    type: "KILL"
  }));
}