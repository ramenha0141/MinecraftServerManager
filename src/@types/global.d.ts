import { BrowserWindow, IpcRendererEvent } from 'electron'

export interface Profile {
    path: string,
    version?: versions
}
export type Profiles = {[key: string]: Profile};

export interface LauncherAPI {
    getProfiles: () => Promise<Profiles>,
    setProfiles: (profiles: Profiles) => void,
    showFolderSelector: () => Promise<string | undefined>,
    launch: (profileId: string) => void
}

export interface ServerAPI {
    isInstalled: () => Promise<boolean>,
    install: (version: versions) => Promise<boolean>,
    agreeEULA: () => Promise<boolean>,
    start: () => Promise<boolean>,
    stop: () => Promise<boolean>,
    showConsole: () => void,
    getConfig: () => Promise<{[key: string]: string}>,
    setConfig: (config: {[key: string]: string}) => void,
    getBackups: () => Promise<number[]>,
    createBackup: () => Promise<boolean>,
    deleteBackup: (backup: number) => Promise<number[]>,
    restore: (backup: number) => Promise<boolean>
}

export interface ConsoleAPI {
    onData: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void,
    sendCommand: (text: string) => void
}

declare global {
    interface Window {
        LauncherAPI: LauncherAPI,
        ServerAPI: ServerAPI,
        ConsoleAPI: ConsoleAPI
    }
    var consoleWindow: BrowserWindow | undefined;
}

type versions = '1.19' | '1.18.2' | '1.16.5' | '1.12.2';