const { app, screen, Tray, Menu, nativeImage, BrowserWindow, contextBridge, ipcRenderer, ipcMain } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const isDev = require('electron-is-dev');
const os = require('node:os');
const path = require('path');
let win;
const createWindow = ({x}) => {
  win = new BrowserWindow({
    width: 250,
    // height: 400,
    // backgroundColor: '#aa111100',
    // transparent: true,
    vibrancy: 'dark',
    // show: false,
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

let tray;



const parsedObject = {PerCore: new Array(20)};

async function getSample() {
  const { stdout, stderr } = await exec(`/Applications/"Intel Power Gadget"/PowerLog -resolution 1000 -duration 8 -verbose -file /dev/null`);
  const text = stdout.split("--------------------------");
  // console.log(stdout)
  for (let block of text) {

  
    const lines = [];
    for (const line of block.split("\n")) {
        if (line.startsWith("\t")) lines.push(line.slice(1));
        else if (!line.startsWith("-") && !line.startsWith("Done") && line !== "") lines.push(line);
    }
    let count = 0;
    for (let line of lines) {
      
      if(line.startsWith("core")) {
        const array = line.split(/MHz |Celcius /g).map(x => x.replace(/(core \d+ )/, ""))
        if (typeof parsedObject.PerCore[count] !== "object") parsedObject.PerCore[count] = {};
        const object = parsedObject.PerCore[count];
        count++;
        for (const item of array) {
          const keyValuePair = item.split(":");
          const key = keyValuePair[0]
          if(!key.startsWith("core")) object[key] = keyValuePair[1]?.trim().split(' ')[0];
        }
 
      } else {
        const keyValuePair = line.split(/:|\?/g);
        if (keyValuePair[1]) parsedObject[keyValuePair[0]] = keyValuePair[1]?.trim().split(' ')[0];
      }
    }
  }

  
  if (parsedObject["package temperature"]) tray.setTitle(

    `${parsedObject["package temperature"].split(".")[0]}°`

  );

}

app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('icon.png');
  let toggle = true;
  tray = new Tray(icon);
  ipcMain.on('getWindowHeight', (e, height) => win.setSize(250, height+30));

  setInterval(() => {
    getSample();
    win?.webContents.send('sendData', parsedObject);
  }, 1000)

  const contextMenu = Menu.buildFromTemplate([

    { label: "open", click: () => createWindow(screen.getCursorScreenPoint())}

  ])


  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)
  contextBridge.exposeInMainWorld(
    'electron', {
        electron: true
    });
  // note: your contextMenu, Tooltip and Title code will go here!
})


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

