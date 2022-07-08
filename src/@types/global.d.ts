import { BrowserWindow, IpcRendererEvent } from 'electron'

export interface ServerAPI {
    isInstalled: () => Promise<boolean>,
    install: () => Promise<boolean>,
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
