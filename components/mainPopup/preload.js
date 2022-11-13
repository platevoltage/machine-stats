
const { contextBridge, ipcRenderer } = require('electron');


  contextBridge.exposeInMainWorld(
    'api', {
        getData: data => ipcRenderer.on('sendData',data),
        sendWindowHeight: windowHeight => ipcRenderer.send('getWindowHeight', windowHeight),
        setDetached: () => ipcRenderer.send('setDetached')
    });


