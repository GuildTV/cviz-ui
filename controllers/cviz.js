
export function cvizSocketBind(Models, channelState, socket){

  channelState.each(ch => socket.emit('cvizState', ch.cvizState()));

  socket.on('cvizState', () => {
    channelState.each(ch => socket.emit('cvizState', ch.cvizState()));
  });

  socket.on('cvizGo', data => {
    console.log("cvizGo: #"+data.id);

    channelState.writeToChannel(data.id, {
      type: "CUE"
    });
  });

  socket.on('cvizKill', data => {
    console.log("cvizKill: #"+data.id);

    channelState.writeToChannel(data.id, {
      type: "KILL"
    });
  });

  socket.on('cvizRun', data => {
    console.log("cvizRun: #"+data.id, data);

    // not pretty, but data needs to be passed as an object of strings
    const parameters = {};

    for(let k in data.data.SceneData) {
      const d = data.data.SceneData[k];

      parameters[d.name] = d.value;
    }

    channelState.writeToChannel(data.id, {
      type: "LOAD",
      timelineFile: data.template,
      instanceName: data.dataId,
      parameters: parameters,
    });
  });

}
