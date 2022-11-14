
import { contextBridge, ipcRenderer } from 'electron';


  contextBridge.exposeInMainWorld(
    'api', {
        getData: data => ipcRenderer.on('sendData',data),
        sendWindowHeight: windowHeight => ipcRenderer.send('getWindowHeight', windowHeight),
        setDetached: () => ipcRenderer.send('setDetached'),
        closeWindow: () => ipcRenderer.send('closeWindow')
    });


