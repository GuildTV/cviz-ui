import net from 'net';

import { cvizHost, cvizPort, cvizTemplateId } from "../config";

let pingInterval = null;

const client = new net.Socket();
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
    client.write(JSON.stringify({
      type: "ping",
      ping: Date.now()
    }));
  }, 300);
});

client.on('close', () => {
  console.log("Server has gone away!");
  if(pingInterval != null){
    clearInterval(pingInterval);
    pingInterval = null;
  }
});

export default function(Models, socket){
  client.on('data', (data) => {
    try {
      data = JSON.parse(data);
      switch (data.type){
        case "ping":
          break;
        case "state":
          if (!data.state || data.state.length == 0)
            break;

          const state = data.state.find(e => e.timelineId == cvizTemplateId);
          if (state)
            socket.emit("templateState", state);

          break;
        case "timelines":
          socket.emit('templateList', data.timelines);
          break;
        case "channels":
          socket.emit("channelList", data.channels);
          break;
        default:
          console.log("CViz: Unknown response type:", data.type);
      }

    } catch (e){
      console.log("CViz read error:", e);
    }
  });

  socket.on('runTemplate', runTemplate);

  socket.on('templateGo', goTemplate);

  socket.on('templateKill', killTemplate);

  socket.on('templateList', templateList);
  socket.on('channelList', channelList);
}

export function runTemplate (data){
  console.log("runTemplate", data);

  // not pretty, but data needs to be passed as an object of strings
  const templateData = {};

  for(let k in data.data.SceneData) {
    const d = data.data.SceneData[k];

    templateData[d.name] = d.value;
  }

  client.write(JSON.stringify({
    type: "action",
    action: {
      type: "LOAD",
      filename: data.template,
      templateData: templateData,
      templateDataId: data.dataId
    }
  }));
}

export function goTemplate (){
  console.log("templateGo");

  client.write(JSON.stringify({
    type: "action",
    action: {
      type: "CUE"
    }
  }));
}

export function killTemplate(){
  console.log("templateKill");

  client.write(JSON.stringify({
    type: "action",
    action: {
      type: "KILL"
    }
  }));
}

function templateList (){
  console.log("templateList");

  client.write(JSON.stringify({
    type: "timelines"
  }));
}

function channelList (){
  console.log("channelList");

  client.write(JSON.stringify({
    type: "channels"
  }));
}