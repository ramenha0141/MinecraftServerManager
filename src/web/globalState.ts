import { atom } from 'recoil';

export const isServerRunningState = atom({
    key: 'isServerRunning',
    default: false
});