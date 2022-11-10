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

// async function getTemp() {
//   const { stdout, stderr } = await exec('/Applications/"Intel Power Gadget"/PowerLog -duration 1 | grep "package temperature:"  | head -1');
//   // console.log(stdout);
//   tray2.setTitle((+stdout.split(" ")[2]).toString() + "°C");

// }
async function getSample() {
  const { stdout, stderr } = await exec(`/Applications/"Intel Power Gadget"/PowerLog -resolution 1000 -duration 1 -verbose -file /dev/null`);
  const byLine = [];
  const parsedObject = {perCore: new Array};
  for (const line of stdout.split("\n")) {
      if (line.startsWith("\t")) byLine.push(line.slice(1));
      else if (!line.startsWith("-") && !line.startsWith("Done") && line !== "") byLine.push(line);
  }

  for (const line of byLine) {
    
    if(line.startsWith("core")) {
      const array = line.split(/MHz |Celcius /g).map(x => x.replace(/(core \d+ )/, ""))
      const object = {};
      for (const item of array) {
        const keyValuePair = item.split(":");
        const key = keyValuePair[0]
        object[keyValuePair[0]] = keyValuePair[1].trim();
      }
      if (object.frequency) parsedObject.perCore.push( object );
    } else {
      const keyValuePair = line.split(/:|\?/g);
      parsedObject[keyValuePair[0]] = keyValuePair[1];
    }
  }
  console.log(parsedObject);
  // tray2.setTitle((+stdout.split(" ")[2]).toString() + "°C");

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
    // getTemp();
    getSample();

  }, 5000)
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


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});