
const { contextBridge, ipcRenderer } = require('electron');


  contextBridge.exposeInMainWorld(
    'api', {
        getData: data => ipcRenderer.on('sendData',data),
        sendGraph: canvas => ipcRenderer.send('getGraph', canvas)
        
    });


