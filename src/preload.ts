import { contextBridge, ipcRenderer } from 'electron';
import { ServerAPI, versions } from './@types/global';

const api: ServerAPI = {
    isInstalled: (): Promise<boolean> => {
        return ipcRenderer.invoke('isInstalled');
    },
    install: (version: versions): Promise<boolean> => {
        return ipcRenderer.invoke('install', version);
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
    showConsole: () => {
        ipcRenderer.send('showConsole');
    },
    getConfig: (): Promise<{[key: string]: string}> => {
        return ipcRenderer.invoke('getConfig');
    },
    setConfig: (config: {[key: string]: string}) => {
        ipcRenderer.send('setConfig', config);
    },
    getBackups: () => {
        return ipcRenderer.invoke('getBackups');
    },
    createBackup: () => {
        return ipcRenderer.invoke('createBackup');
    },
    deleteBackup: (backup: number) => {
        return ipcRenderer.invoke('deleteBackup', backup);
    },
    restore: (backup: number) => {
        return ipcRenderer.invoke('restore', backup);
    }
};
contextBridge.exposeInMainWorld('ServerAPI', api);