import type { ChildProcessWithoutNullStreams } from 'child_process';
import fs from 'fs';

class ServerController {
    constructor(ServerPath: string, logPath: string) {
        this.ServerPath = ServerPath;
        this.logPath = logPath;
    }
    ServerPath: string;
    logPath: string;
    isRunning: boolean = false;
    process?: ChildProcessWithoutNullStreams;
    async start(): Promise<boolean> {
        const spawn = (await import('child_process')).spawn;
        this.process = spawn('java', ['-jar', 'server.jar', '-nogui'], { cwd: this.ServerPath});
        this.process.stdout.pipe(process.stdout);
        if (fs.existsSync(this.logPath)) fs.rmSync(this.logPath);
        this.process.stdout.on('data', (data: Buffer) => {
            const str = data.toString();
            consoleWindow?.webContents.send('data', str);
            fs.appendFileSync(this.logPath, str, 'utf-8');
        });
        this.isRunning = true;
        return waitForStartup(this.process);
    }
    async stop(): Promise<boolean> {
        if (!this.process) return false;
        this.process.stdin.write('stop\n');
        await waitForStop(this.process);
        this.isRunning = false;
        if (fs.existsSync(this.logPath)) fs.rmSync(this.logPath);
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