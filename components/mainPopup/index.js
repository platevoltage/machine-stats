const { BrowserWindow, ipcMain } = require('electron');

const path = require('path');

const createMainPopup = (data, {x}) => {
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

    return win
      
  };

  module.exports = createMainPopup;