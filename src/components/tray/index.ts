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
    graphCanvas.loadFile(path.join(__dirname, '../../public/canvas/index.html'));
    const tray = new Tray(nativeImage.createEmpty());

    let mainPopup;
    const menu = Menu.buildFromTemplate([
      {label: 'Quit', role: 'quit' }
    ]);

    tray.addListener('click', (e) => {
      if (mainPopup?.isDestroyed() || mainPopup === undefined) {
        mainPopup = createMainPopup(data);
        mainPopup.setPosition(Math.ceil(tray.getBounds().x + tray.getBounds().width/2 - mainPopup.getBounds().width/2), 0);
      }
      else if (mainPopup.isMovable()) {
        tray.popUpContextMenu(menu);
      }
      else {
        mainPopup.close();
      }
    })

    tray.addListener('right-click', (e) => {
      tray.popUpContextMenu(menu);
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

  export default createGraphTray;