import { atom } from 'recoil';

export const isInstalledState = atom<boolean>({
    key: 'isInstalled',
    default: window.ServerAPI.isInstalled()
});
export const isServerRunningState = atom<boolean>({
    key: 'isServerRunning',
    default: false
});