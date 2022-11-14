
import { contextBridge, ipcRenderer } from 'electron';


  contextBridge.exposeInMainWorld(
    'api', {
        getData: (data: any) => ipcRenderer.on('sendData',data),
        sendGraph: (canvas: HTMLCanvasElement) => ipcRenderer.send('getGraph', canvas)
        
    });


