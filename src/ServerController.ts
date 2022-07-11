import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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
        const logPath = path.join(this.ServerPath, 'server.log');
        if (fs.existsSync(logPath)) fs.rmSync(logPath);
        this.process.stdout.on('data', (data: Buffer) => {
            const str = data.toString();
            consoleWindow?.webContents.send('data', str);
            fs.appendFileSync(logPath, str, 'utf-8');
        });
        this.isRunning = true;
        return waitForStartup(this.process);
    }
    async stop(): Promise<boolean> {
        if (!this.process) return false;
        this.process.stdin.write('stop\n');
        await waitForStop(this.process);
        this.isRunning = false;
        const logPath = path.join(this.ServerPath, 'server.log');
        if (fs.existsSync(logPath)) fs.rmSync(logPath);
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