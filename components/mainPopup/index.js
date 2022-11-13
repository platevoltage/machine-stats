const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');

const path = require('path');
let accentColor = `#${systemPreferences.getAccentColor()}`;
const createMainPopup = (data) => {
    const win = new BrowserWindow({
      width: 250,
      height: 0,
      vibrancy: 'dark',
      useContentSize: true,
      frame: false,
      show: false,
      titleBarStyle: 'hidden',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
    
    const interval = setInterval(() => {
      win.webContents.send('sendData', { data, color: accentColor });
    }, 1000);
    // win.loadURL('http://localhost:3000/index.html');

    win.loadFile(path.join(__dirname, 'popup/build/index.html')) 

    win.once('ready-to-show', () => {
      app.dock.show();
      win.webContents.send('sendData', { data, color: accentColor });
      ipcMain.on('getWindowHeight', (e, height) => {
        win.setSize(250, height+30);
      });
      win.show();
    })

    win.on('closed', () => {
      clearInterval(interval);
      ipcMain.removeAllListeners('sendData');
      ipcMain.removeAllListeners('getWindowHeight');
      app.dock.hide();
      win.destroy()
    });

    return win
      
  };

  module.exports = createMainPopup;