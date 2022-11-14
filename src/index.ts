const { app } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const getSample = require('./helpers/powerGadget');
const createGraphTray = require('./components/tray');


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

