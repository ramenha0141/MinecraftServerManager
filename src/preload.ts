import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ServerAPI', {
    start: (): Promise<boolean> => {
        return ipcRenderer.invoke('start');
    },
    stop: (): Promise<boolean> => {
        return ipcRenderer.invoke('stop');
    },
    showPerformanceWindow: () => {
        ipcRenderer.send('showPerformanceWindow');
    },
    showLogWindow: () => {
        ipcRenderer.send('showLogWindow');
    },
    getConfig: (): Promise<Config> => {
        return ipcRenderer.invoke('getConfig');
    },
    setConfig: (config: Config) => {
        ipcRenderer.send('setConfig', config);
    }
});