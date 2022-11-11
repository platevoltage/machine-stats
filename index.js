const { app, screen, Tray, Menu, nativeImage, BrowserWindow, contextBridge, ipcRenderer, ipcMain, systemPreferences } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const getSample = require('./powerGadget');

// let win;
// let tray;
// let graphCanvas
let accentColor = `#${systemPreferences.getAccentColor()}`;
console.log(accentColor);
let data;
const createGraphCanvas = () => {
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
  graphCanvas.loadFile('canvas/index.html');
  const tray = new Tray(nativeImage.createEmpty());
  ipcMain.on('getGraph', (event, graphData) => {
    const image = nativeImage.createFromDataURL(graphData);
    tray.setImage( image );
  });
    const contextMenu = Menu.buildFromTemplate([
    { label: "open", click: () => createWindow(screen.getCursorScreenPoint())}
  ]);
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu);
  setInterval(async () => {
    data = await getSample();
    if (data["package temperature"]) tray.setTitle(
      `${data["package temperature"].split(".")[0]}°`
    );
    // win?.webContents.send('sendData', data);
    graphCanvas?.webContents.send('sendData', { data, color: accentColor});
  }, 1000)
}

const createWindow = ({x}) => {
  const win = new BrowserWindow({
    width: 250,
    vibrancy: 'dark',
    useContentSize: true,
    frame: false,
    x: x - 125,
    y: 0,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // isDev ?
  const interval = setInterval(async () => {
    win.webContents.send('sendData', data);
  }, 1000);
  win.loadURL('http://localhost:3000/index.html');
  ipcMain.on('getWindowHeight', (e, height) => {
    win.setSize(250, height+30);
  });
  // win.loadFile('./popup/build/index.html') 
  win.on('closed', () => {
    clearInterval(interval);
    ipcMain.removeAllListeners('sendData');
    ipcMain.removeAllListeners('getWindowHeight');
    win.destroy()
  });
    
};

app.whenReady().then(() => {
  createGraphCanvas();

  


  // note: your contextMenu, Tooltip and Title code will go here!
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

