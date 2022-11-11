const { app, screen, Tray, Menu, nativeImage, BrowserWindow, contextBridge, ipcRenderer, ipcMain, systemPreferences } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const getSample = require('./helpers/powerGadget');

const createGraphTray = require('./components/tray');


let data = {};
// const createGraphCanvas = () => {
//   const graphCanvas = new BrowserWindow({
//     show: false,
//     useContentSize: true,
//     titleBarStyle: 'hidden',
//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: true,
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })
//   graphCanvas.loadFile('helpers/utilizationGraphCanvas/index.html');
//   const tray = new Tray(nativeImage.createEmpty());
//   ipcMain.on('getGraph', (event, graphData) => {
//     const image = nativeImage.createFromDataURL(graphData);
//     tray.setImage( image );
//   });
//     const contextMenu = Menu.buildFromTemplate([
//     { label: "open", click: () => createMainPopup(data, screen.getCursorScreenPoint())}
//   ]);
//   tray.setToolTip('This is my application.')
//   tray.setContextMenu(contextMenu);
//   setInterval(() => {
//     if ("package temperature" in data) {
//       tray.setTitle(`${data["package temperature"].split(".")[0]}°`);
//       graphCanvas?.webContents.send('sendData', { data, color: accentColor});
//     }
//   }, 1000)
// };



app.whenReady().then(async () => {
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

