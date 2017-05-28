import net from 'net';
import JSONStream from 'JSONStream';

function writeLog(conf, msg){
  console.log("CViz #" + conf.id + ": " + msg);
}

function createClient(conf, emitstate) {
  const client = {
    id: conf.id,
    pingInterval: null,
    lastState: "{}",
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
      const stringData = JSON.stringify(data);
      if(stringData == "{}" || client.lastState == stringData)
        return;

      client.lastState = stringData;

      data.id = conf.id;
      emitstate(data);
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

export class ChannelStateStore {
  constructor(config, stateJson, emitstate){
    this._channels = {};

    for(let conf of config){
      const client = createClient(conf, emitstate);
      const state = {
        id: conf.id,
        mode: 'scene', // or playlist
        playlistId: 0,
        playlistNextPos: 0, // next item in the playlist
      };

      const oldS = stateJson[conf.id];
      if (oldS){
        Object.assign(state, oldS);
      }

      this._channels[conf.id] = new ChannelState(client, state);
    }
  }

  findChannel(id){
    return this._channels[id];
  }
  findChannelAfter(id, offset){
    const keys = Object.keys(this._channels);
    let index = keys.indexOf(id);
    if (index == -1 || keys.length == 0)
      return undefined;

    index += offset;
    while (index < 0)
      index += keys.length;
    while (index >= keys.length)
      index -= keys.length

    const newId = keys[index];
    return this._channels[newId];
  }

  writeToChannel(id, msg){
    const ch = this._channels[id];
    if (!ch)
      return console.log("CViz #" + id + ": Write failed (Invalid channel)");

    return ch.write(msg);
  }

  each(cb){
    return Object.keys(this._channels).map(k => cb(this._channels[k]));
  }

  json(){
    return this.each(ch => ch.state());
  }

}

export class ChannelState {
  constructor(client, state){
    this._client = client;
    this._state = state;
  }

  id(){
    return this._client.id;
  }

  setProps(props){
    console.log("setProps", props);
    Object.assign(this._state, props);
  }

  write(msg){
    if (typeof msg == "object")
      msg = JSON.stringify(msg);

    this._client.socket.write(msg);
  }

  cvizState(){
    return Object.assign({ id: this.id() }, JSON.parse(this._client.lastState));
  }

  state(){
    return Object.assign({ id: this.id() }, this._state);
  }
}