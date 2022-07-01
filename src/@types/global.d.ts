export interface ServerAPI {
    isInstalled: () => Promise<boolean>,
    install: () => Promise<boolean>,
    agreeEULA: () => Promise<boolean>,
    start: () => Promise<boolean>,
    stop: () => Promise<boolean>,
    showPerformanceWindow: () => void,
    showLogWindow: () => void,
    getConfig: () => Promise<{[key: string]: string}>,
    setConfig: (config: {[key: string]: string}) => void
}

declare global {
    interface Window {
        ServerAPI: ServerAPI
    }
}
