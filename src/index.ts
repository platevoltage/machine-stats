import { app } from 'electron';

import getSample from './helpers/powerGadget';
import createGraphTray from './components/tray';


let data = {};


app.whenReady().then(async () => {
  app.dock.hide();
  data = await getSample();
  setInterval( async () => {
    data = await getSample();
  },1000)
  createGraphTray(data);
  
  // note: your contextMenu, Tooltip and Title code will go here!
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

