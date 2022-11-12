const { screen, Tray, Menu, nativeImage, BrowserWindow, ipcMain, systemPreferences } = require('electron');
const path = require('path');
let accentColor = `#${systemPreferences.getAccentColor()}`;
const createMainPopup = require('../mainPopup');
const createGraphTray = (data) => {
    const graphCanvas = new BrowserWindow({
      show: false,
      useContentSize: true,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    })
    graphCanvas.loadFile('components/tray/canvas/index.html');
    const tray = new Tray(nativeImage.createEmpty());

    let mainPopup;
    tray.addListener('click', (e) => {
      if (mainPopup?.isDestroyed() || mainPopup === undefined) {
        mainPopup = createMainPopup(data, screen.getCursorScreenPoint());
      }
      else {
        mainPopup.close();
      }
    })
    ipcMain.on('getGraph', (_event, graphData) => {
      const image = nativeImage.createFromDataURL(graphData);
      tray.setImage( image );
    });

    setInterval(() => {
      if ("package temperature" in data) {
        tray.setTitle(`${data["package temperature"]}°`);
        graphCanvas?.webContents.send('sendData', { data, color: accentColor});
      }
    }, 1000)
  };

  module.exports = createGraphTray;