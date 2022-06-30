export interface ServerAPI {
    isInstalled: () => Promise<boolean>,
    start: () => Promise<boolean>,
    stop: () => Promise<boolean>,
    showPerformanceWindow: () => void,
    showLogWindow: () => void,
    getConfig: () => Promise<Config>,
    setConfig: (config: Config) => void
}

declare global {
    interface Window {
        ServerAPI: ServerAPI
    }
}
