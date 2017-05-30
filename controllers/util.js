import fs from 'fs';

export function saveState(channelState){
  const newState = {};
  
  channelState.each(ch => {
    const st = ch.state();
    newState[ch.id()] = {
      id: ch.id(),
      mode: st.mode,
      playlistId: st.playlistId,
    };
  })

  fs.writeFile('state.json', JSON.stringify(newState), (err) => {
    if (err) 
      console.log('Failed to write state:', err);
  });
}

export function loadState(){
  try {
    return JSON.parse(fs.readFileSync("state.json"));

  } catch (e){
    console.log("Failed to load old state:", e);
    return {};
  }
}