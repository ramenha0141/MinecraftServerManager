import { BrowserWindow, IpcRendererEvent } from 'electron'

export interface ServerAPI {
    isInstalled: () => Promise<boolean>,
    install: (version: versions) => Promise<boolean>,
    agreeEULA: () => Promise<boolean>,
    start: () => Promise<boolean>,
    stop: () => Promise<boolean>,
    togglePerformance: () => void,
    showConsole: () => void,
    getConfig: () => Promise<{[key: string]: string}>,
    setConfig: (config: {[key: string]: string}) => void
}

export interface ConsoleAPI {
    onData: (callback: (event: IpcRendererEvent, ...args: any[]) => void) => void
}

declare global {
    interface Window {
        ServerAPI: ServerAPI,
        ConsoleAPI: ConsoleAPI
    }
    var consoleWindow: BrowserWindow | undefined;
}

type versions = '1.19' | '1.18.2' | '1.16.5' | '1.12.2';