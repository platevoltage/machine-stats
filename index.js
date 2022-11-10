const { app, Tray, Menu, nativeImage, BrowserWindow } = require('electron');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('node:os');


const createWindow = () => {
  const win = new BrowserWindow({
    width: 250,
    height: 400,
    // frame: false,
    // titleBarStyle: 'hidden'
  });

  win.loadFile('index.html');
};

let tray;
let tray2;
///Applications/Intel\ Power\ Gadget/PowerLog -duration 1 -verbose  | grep "IA temperature:"  | head -1
async function getTemp() {
  const { stdout, stderr } = await exec('/Applications/"Intel Power Gadget"/PowerLog -duration 1 | grep "package temperature:"  | head -1');
  // console.log('stdout:', stdout.split(" ")[2]);
  tray2.setTitle((+stdout.split(" ")[2]).toString() + "°C");
  // console.log('stderr:', stderr);
}
app.whenReady().then(() => {
  const icon = nativeImage.createFromPath('icon.png');
  let toggle = true;
  // tray = new Tray(icon);
  tray2 = new Tray(icon);
  
  setInterval(() => {
    // tray = nativeImage.createFromPath('icon2.png');
    // tray.setImage(nativeImage.createFromPath(toggle ? 'icon2.png' : 'icon.png'));
    toggle = !toggle;
    getTemp();

  }, 1000)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ])
  tray.setToolTip('This is my application.')
  tray.setContextMenu(contextMenu)

  // note: your contextMenu, Tooltip and Title code will go here!
})

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow();
//     }
//   });
// });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});