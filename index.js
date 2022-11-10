const { app, Tray, Menu, nativeImage, BrowserWindow, contextBridge, ipcRenderer, ipcMain } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const isDev = require('electron-is-dev');
const os = require('node:os');
const path = require('path');
let win;
const createWindow = () => {
  win = new BrowserWindow({
    width: 250,
    height: 400,
    show: false,
    // frame: false,
    // titleBarStyle: 'hidden'
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
  }
  });
  // isDev ?
    win.loadFile('./popup/build/index.html') 
    // win.loadURL('http://localhost:3000/index.html');
    
};

let tray;
let tray2;

// async function getTemp() {
//   const { stdout, stderr } = await exec('/Applications/"Intel Power Gadget"/PowerLog -duration 1 | grep "package temperature:"  | head -1');
//   // console.log(stdout);
//   tray2.setTitle((+stdout.split(" ")[2]).toString() + "°C");

// }
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
        // console.log(object);
        // parsedObject.perCore.push( object );
      } else {
        const keyValuePair = line.split(/:|\?/g);
        if (keyValuePair[1]) parsedObject[keyValuePair[0]] = keyValuePair[1]?.trim().split(' ')[0];
      }
    }
  }
  // console.log(JSON.stringify(parsedObject).length);
  
  if (parsedObject["package temperature"]) tray.setTitle(

    `${parsedObject["package temperature"].split(".")[0]}°`

  );

}
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('icon.png');
  let toggle = true;
  tray = new Tray(icon);
  // tray2 = new Tray(icon);
  createWindow();
  setInterval(() => {
    // tray = nativeImage.createFromPath('icon2.png');
    // tray.setImage(nativeImage.createFromPath(toggle ? 'icon2.png' : 'icon.png'));
    toggle = !toggle;
    // getTemp();
    getSample();
    win.webContents.send('sendData', parsedObject);
    

  }, 1000)
  const contextMenu = Menu.buildFromTemplate([
    { label: "open", click: () => win.show()}
    // { label: 'Item1', type: 'radio' },
    // { label: 'Item2', type: 'radio' },
    // { label: 'Item3', type: 'radio', checked: true },
    // { label: 'Item4', type: 'radio' }
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

