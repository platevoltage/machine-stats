
import { contextBridge, ipcRenderer } from 'electron';


  contextBridge.exposeInMainWorld(
    'api', {
        getData: (data:any) => ipcRenderer.on('sendData',data),
        sendWindowHeight: (windowHeight: number) => ipcRenderer.send('getWindowHeight', windowHeight),
        setDetached: () => ipcRenderer.send('setDetached'),
        closeWindow: () => ipcRenderer.send('closeWindow')
    });


