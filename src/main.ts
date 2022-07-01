import path from 'path';
import fs from 'fs';
import axios from 'axios';
import child_process from 'child_process';
import { searchDevtools } from 'electron-search-devtools';
import { BrowserWindow, app, session, ipcMain } from 'electron';
import { Readable } from 'stream';

const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    require('electron-reload')(__dirname, {
        electron: path.resolve(
            __dirname,
            process.platform === 'win32'
                ? '../node_modules/electron/dist/electron.exe'
                : '../node_modules/.bin/electron'
        ),
    });
}

const ServerPath = './.minecraft';
const jarPath = path.join(ServerPath, 'server.jar');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        },
    });
    ipcMain.handle('isInstalled', () => {
        return false;
    });
    ipcMain.handle('install', async () => {
        try {
            if (fs.existsSync(ServerPath)) fs.rmSync(ServerPath, { recursive: true });
            fs.mkdirSync(ServerPath);
            const  { data } = await axios.get<Readable>(
                'https://launcher.mojang.com/v1/objects/e00c4052dac1d59a1188b2aa9d5a87113aaf1122/server.jar',
                { responseType: 'stream' }
            );
            data.pipe(fs.createWriteStream(jarPath));
            return await new Promise<boolean>((resolve) => {
                data.on('error', () => resolve(false));
                data.on('end', () => {
                    child_process.execSync(`cd ${ServerPath} && java -jar ${jarPath}`);
                    resolve(true);
                });
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    });
    ipcMain.handle('start', () => {
        console.log('start');
        return true;
    });
    ipcMain.handle('stop', () => {
        console.log('stop');
        return true;
    });
    ipcMain.on('showPerformanceWindow', () => {

    });
    ipcMain.on('showLogWindow', () => {

    });
    ipcMain.handle('getConfig', () => {
        return {};
    });
    ipcMain.on('setConfig', (_, config: Config) => {

    });
    mainWindow.setMenuBarVisibility(false);

    if (isDev) {
        searchDevtools('REACT')
            .then((devtools) => {
                session.defaultSession.loadExtension(devtools, {
                    allowFileAccess: true,
                });
            })
            .catch((err) => console.log(err));

        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    mainWindow.loadFile('dist/index.html');
};

app.whenReady().then(createWindow);
app.once('window-all-closed', () => app.quit());