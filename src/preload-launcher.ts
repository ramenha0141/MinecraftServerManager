import { contextBridge, ipcRenderer } from 'electron';
import { LauncherAPI, Profiles } from './@types/global';

const LauncherAPI: LauncherAPI = {
    getProfiles: () => {
        return ipcRenderer.invoke('getProfiles');
    },
    setProfiles: (profiles: Profiles) => {
        ipcRenderer.send('setProfiles', profiles);
    },
    launch: (profileId: string) => {
        ipcRenderer.send('launch', profileId);
    }
};
contextBridge.exposeInMainWorld('LauncherAPI', LauncherAPI);