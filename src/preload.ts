import { contextBridge, ipcRenderer } from 'electron';
import { ServerAPI } from './@types/global';

const api: ServerAPI = {
    isInstalled: (): Promise<boolean> => {
        return ipcRenderer.invoke('isInstalled');
    },
    install: (): Promise<boolean> => {
        return ipcRenderer.invoke('install');
    },
    agreeEULA: (): Promise<boolean> => {
        return ipcRenderer.invoke('agreeEULA');
    },
    start: (): Promise<boolean> => {
        return ipcRenderer.invoke('start');
    },
    stop: (): Promise<boolean> => {
        return ipcRenderer.invoke('stop');
    },
    togglePerformance: () => {
        ipcRenderer.send('togglePerformance');
    },
    showConsole: () => {
        ipcRenderer.send('showConsole');
    },
    getConfig: (): Promise<{[key: string]: string}> => {
        return ipcRenderer.invoke('getConfig');
    },
    setConfig: (config: {[key: string]: string}) => {
        ipcRenderer.send('setConfig', config);
    }
};
contextBridge.exposeInMainWorld('ServerAPI', api);