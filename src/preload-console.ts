import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ConsoleAPI } from './@types/global';

const api: ConsoleAPI = {
    onData: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('data', callback);
    }
};
contextBridge.exposeInMainWorld('ConsoleAPI', api);