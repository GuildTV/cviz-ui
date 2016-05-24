var net = require('net');
var linq = require('linq');
var mapSeries = require('promise-map-series');

import { cvizHost, cvizPort } from "../config"

var lastState = {};
var pingInterval = null;

var client = new net.Socket();
client.setNoDelay(true);
client.setTimeout(500);

client.on('error', () => {
  console.log("lost connection to cviz");

  client.destroy();
  client.unref();
  client.connect(cvizPort, cvizHost, () => {
    console.log("reconnected");
  });
});

client.connect(cvizPort, cvizHost, function() {
  console.log('Connected to cviz');

  pingInterval = setInterval(() => {
    client.write("{}");
  }, 300)
});

client.on('data', (data) => {
  try {
    if(data == "{}")
      return;

    lastState = JSON.parse(data);
    console.log("Received", lastState);
  } catch (e){
  }
});

client.on('close', () => {
  console.log("Server has gone away!");
  if(pingInterval != null){
    clearInterval(pingInterval);
    pingInterval = null;
  }
});

export default function(Models, socket, config){
  let { Person, Position } = Models;

  socket.emit('templateState', lastState);
  
  client.on('data', (data) => {
    try {
      if(data == "{}")
        return;

      data = JSON.parse(data);

      socket.emit('templateState', data);
    } catch (e){
    }
  });

  socket.on('runTemplate', runTemplate);

  socket.on('templateGo', goTemplate);

  socket.on('templateKill', killTemplate);

  // TODO - send templateState at appropriate points
  // data format: 
  // {
  //   state: "STOP", // or WAIT or PLAYING
  //   dataId: "ado-ben",
  //   templateId: "lowerThird"
  // }
}

export function runTemplate (data){
  console.log("runTemplate", data);

  // not pretty, but data needs to be passed as an object of strings
  var templateData = {};

  for(var k in data.data.data) {
    const d = data.data.data[k];

    templateData[d.name] = d.value;
  }

  client.write(JSON.stringify({
    type: "LOAD",
    filename: data.template,
    templateData: templateData,
    templateDataId: data.dataId
  }));
}

export function goTemplate (){
  console.log("templateGo");

  client.write(JSON.stringify({
    type: "CUE"
  }));
}

export function killTemplate(){
  console.log("templateKill");

  client.write(JSON.stringify({
    type: "KILL"
  }));
}