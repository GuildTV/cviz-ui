import { saveState } from './util';

export function settingsApiBind(Models, channelState, app){

  // run api
  app.get('/api/settings', (req, res) => {
    res.send(channelState.json());
  });
  app.get('/api/settings/:id', (req, res) => {
    const ch = channelState.findChannel(req.params.id)
    if (!ch)
      res.status(404).send("");

    res.send(ch.state());
  });
  app.post('/api/settings/:id', (req, res) => {
    const ch = channelState.findChannel(req.params.id)
    if (!ch)
      return res.status(404).send("");

    const newProps = {};

    if (req.body.mode == "playlist") {
      if (newProps.state().playlistId != req.body.playlistId)
        newProps.playlistNextPos = 0;

      newProps.playlistId = req.body.playlistId;
    }

    ch.setProps(newProps);
    saveState(channelState);

    res.send(ch.state());
  });

  app.get('/api/settings/:id/next', (req, res) => {
    const ch = channelState.findChannelAfter(req.params.id, 1)
    if (!ch)
      res.status(404).send("");

    res.send(ch.state());
  });

}