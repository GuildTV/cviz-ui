import fs from 'fs';

export function saveState(channelState){
  const newState = {};
  
  for(let k of Object.keys(channelState)){
    const ch = channelState[k];
    newState[ch.id] = {
      id: ch.id,
      mode: ch.mode,
      playlistId: ch.playlistId,
    };
  }

  fs.writeFile('state.json', JSON.stringify(newState), (err) => {
    if (err) 
      console.log('Failed to write state:', err);
  });
}
