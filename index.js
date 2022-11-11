const { app, screen, Tray, Menu, nativeImage, BrowserWindow, contextBridge, ipcRenderer, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const getSample = require('./powerGadget');

let win;
let tray;
let graphCanvas

const createGraphCanvas = () => {
  graphCanvas = new BrowserWindow({
    show: false,
    useContentSize: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })
  graphCanvas.loadFile('index.html');
}

const createWindow = ({x}) => {
  win = new BrowserWindow({
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
    // win.loadFile('./popup/build/index.html') 
    win.loadURL('http://localhost:3000/index.html');
    win.on('closed', () => win = null)
    
};

app.whenReady().then(() => {
  createGraphCanvas();
  const icon2 = nativeImage.createFromPath('icon.png');
  const icon = nativeImage.createFromNamedImage("NSFolder").resize({width: 10})
  let count = 0;
  ipcMain.on('getGraph', (event, graphData) => {

    const image = nativeImage.createFromDataURL(graphData);
    // console.log(icon)
    tray.setImage( image );
  });
  
  let toggle = true;
  tray = new Tray(icon);
  ipcMain.on('getWindowHeight', (e, height) => win.setSize(250, height+30));

  setInterval(async () => {
    const data = await getSample();
    if (data["package temperature"]) tray.setTitle(
      `${data["package temperature"].split(".")[0]}°`
    );

    win?.webContents.send('sendData', data);
    graphCanvas?.webContents.send('sendData', data);
  }, 1000)

  const contextMenu = Menu.buildFromTemplate([

    { label: "open", click: () => createWindow(screen.getCursorScreenPoint())}

  ])


  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  // note: your contextMenu, Tooltip and Title code will go here!
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

