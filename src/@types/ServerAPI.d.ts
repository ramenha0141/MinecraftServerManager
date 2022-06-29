export interface ServerAPI {
    start: () => boolean,
    stop: () => void,
    showLogWindow: () => void,
    showPerformanceWindow: () => void,
    getConfig: () => any,
    setConfig: (config: string) => void
}