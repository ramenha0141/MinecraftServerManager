import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { ConsoleAPI } from './@types/global';

const api: ConsoleAPI = {
    onData: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on('data', callback);
    },
    sendCommand: (text: string) => {
        ipcRenderer.send('command', text);
    }
};
contextBridge.exposeInMainWorld('ConsoleAPI', api);