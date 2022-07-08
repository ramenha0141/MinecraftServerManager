import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

class ServerController {
    constructor(ServerPath: string) {
        this.ServerPath = ServerPath;
    }
    ServerPath: string;
    isRunning: boolean = false;
    process?: ChildProcessWithoutNullStreams;
    async start(): Promise<boolean> {
        this.process = spawn('java', ['-jar', 'server.jar', '-nogui'], { cwd: this.ServerPath});
        this.process.stdout.pipe(process.stdout);
        this.process.stdout.on('data', (data: Buffer) => consoleWindow?.webContents.send('data', data.toString()));
        this.isRunning = true;
        return waitForStartup(this.process);
    }
    async stop(): Promise<boolean> {
        if (!this.process) return false;
        this.process.stdin.write('stop\n');
        await waitForStop(this.process);
        this.isRunning = false;
        return true;
    }
}
export default ServerController;

const waitForStartup = (process: ChildProcessWithoutNullStreams) => {
    const promise = new Promise<boolean>((resolve) => {
        process.stdout.on('data', (data: string) => {
            if (/Done \(.+?\)! For help, type "help"/.test(data)) {
                resolve(true);
            }
        });
        process.on('close', () => resolve(false));
    });
    return promise;
};
const waitForStop = (process: ChildProcessWithoutNullStreams) => {
    const promise = new Promise<void>((resolve) => {
        process.on('close', () => resolve());
    });
    return promise;
};