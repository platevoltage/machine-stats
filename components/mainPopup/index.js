const { app, BrowserWindow, ipcMain, systemPreferences } = require('electron');

const path = require('path');
let accentColor = `#${systemPreferences.getAccentColor()}`;
let detached = false;
const createMainPopup = (data) => {
    const win = new BrowserWindow({
      width: 250,
      height: 0,
      visualEffectState: "active",
      vibrancy: 'sidebar',
      resizable: false,
      maximizable: false,
      movable: false,
      // titleBarStyle: "hidden",
      useContentSize: true,
      frame: false,
      show: false,
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
      ipcMain.on('getWindowHeight', (_e, height) => {
        win.setSize(250, height+30);
      });
      ipcMain.on('setDetached', () => {
        win.setMovable(true);
        win.setPosition(win.getBounds().x, 40);
        
      });
      ipcMain.on('closeWindow', () => {
        win.close();
      })
      win.show();
    })

    win.on('blur', () => {
      if (!win.isMovable()) win.close();
    })

    win.on('closed', () => {
      clearInterval(interval);
      ipcMain.removeAllListeners('sendData');
      ipcMain.removeAllListeners('getWindowHeight');
      ipcMain.removeAllListeners('setDetached');
      ipcMain.removeAllListeners('closeWindow');
      app.dock.hide();
      win.destroy()
    });

    return win
      
  };

  module.exports = createMainPopup;