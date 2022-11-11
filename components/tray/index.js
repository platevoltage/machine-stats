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
    ipcMain.on('getGraph', (event, graphData) => {
      const image = nativeImage.createFromDataURL(graphData);
      tray.setImage( image );
    });
    const contextMenu = Menu.buildFromTemplate([
    { 
        // label: "open", click: () => {}
        label: "open", click: () => createMainPopup(data, screen.getCursorScreenPoint())
    }
    ]);
    tray.setToolTip('This is my application.')
    tray.setContextMenu(contextMenu);
    setInterval(() => {
      if ("package temperature" in data) {
        tray.setTitle(`${data["package temperature"].split(".")[0]}°`);
        graphCanvas?.webContents.send('sendData', { data, color: accentColor});
      }
    }, 1000)
  };

  module.exports = createGraphTray;