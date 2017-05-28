import { saveState } from './util';

function findChannel(state, id){
  for(let ch of state){
    if (ch.id == id)
      return ch;
  }

  return null;
}

export default function(Models, channelState, app){

  // run api
  app.get('/api/settings', (req, res) => {
    res.send(channelState);
  });
  app.get('/api/settings/:id', (req, res) => {
    for(let s of channelState) {
      if (s.id != req.params.id)
        continue;

      return res.send(s);
    }
    res.status(404).send("");
  });
  app.post('/api/settings/:id', (req, res) => {
    const ch = findChannel(channelState, req.params.id);
    if (!ch)
      return res.status(404).send("");

    if (req.body.mode == "playlist") {
      if (ch.playlistId != req.body.playlistId)
        ch.playlistNextPos = 0;

      ch.playlistId = req.body.playlistId;
    }

    ch.mode = req.body.mode;
    res.send(ch);
    saveState(channelState);
  });

}