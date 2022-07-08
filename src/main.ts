import path from 'path';
import fs from 'fs';
import axios from 'axios';
import child_process from 'child_process';
import { BrowserWindow, app, session, ipcMain, dialog } from 'electron';
import { Readable } from 'stream';
import properties from './properties';
import ServerController from './ServerController';
import windowStateKeeper from 'electron-window-state';
import { versions } from './@types/global';

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
const eulaPath = path.join(ServerPath, 'eula.txt');
const propertiesPath = path.join(ServerPath, 'server.properties');

const ServerVersions: {[key: string]: string} = {
    '1.19': 'https://launcher.mojang.com/v1/objects/e00c4052dac1d59a1188b2aa9d5a87113aaf1122/server.jar',
    '1.18.2': 'https://launcher.mojang.com/v1/objects/c8f83c5655308435b3dcf03c06d9fe8740a77469/server.jar',
    '1.16.5': 'https://launcher.mojang.com/v1/objects/1b557e7b033b583cd9f66746b7a9ab1ec1673ced/server.jar',
    '1.12.2': 'https://launcher.mojang.com/v1/objects/886945bfb2b978778c3a0288fd7fab09d315b25f/server.jar'
};

const createWindow = () => {
    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });
    const mainWindow = new BrowserWindow({
        show: false,
        width: mainWindowState.width,
        height: mainWindowState.height,
        x: mainWindowState.x,
        y: mainWindowState.y,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        },
    });
    ipcMain.handle('isInstalled', async () => {
        return fs.existsSync(eulaPath) && fs.readFileSync(eulaPath).toString() === 'eula=true\n';
    });
    ipcMain.handle('install', async (_, version: versions) => {
        try {
            if (fs.existsSync(ServerPath)) fs.rmdirSync(ServerPath, { recursive: true });
            fs.mkdirSync(ServerPath);
            const { data } = await axios.get<Readable>(
                ServerVersions[version],
                { responseType: 'stream' }
            );
            data.pipe(fs.createWriteStream(jarPath));
            return await new Promise<boolean>((resolve) => {
                data.on('error', () => resolve(false));
                data.on('end', () => {
                    child_process.execSync(`cd ${ServerPath} && java -jar server.jar`);
                    resolve(true);
                });
            });
        } catch (e) {
            console.log(e);
            dialog.showErrorBox('Install Error', (e as Error).toString());
            return false;
        }
    });
    ipcMain.handle('agreeEULA', async () => {
        try {
            fs.writeFileSync(eulaPath, 'eula=true\n');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    });
    const serverController = new ServerController(ServerPath);
    ipcMain.handle('start', async () => {
        return await serverController.start();
    });
    ipcMain.handle('stop', async () => {
        return await serverController.stop();
    });
    ipcMain.on('togglePerformance', () => {

    });
    ipcMain.on('showConsole', () => {
        showConsole();
    });
    ipcMain.handle('getConfig', () => {
        return properties.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    });
    ipcMain.on('setConfig', (_, config: { [key: string]: string }) => {
        fs.writeFileSync(propertiesPath, properties.stringify(config));
    });
    mainWindow.removeMenu();
    mainWindow.loadFile('dist/index.html');
    mainWindow.on('ready-to-show', () => mainWindow.show());
    mainWindow.on('close', async (event) => {
        if (!serverController.isRunning) return;
        const choice = dialog.showMessageBoxSync(mainWindow, {
            type: 'question',
            message: 'アプリケーションを終了する前にサーバーを終了してください',
            buttons: ['終了', 'キャンセル'],
        });
        if (choice === 0) {
            serverController.stop();
        } else {
            event.preventDefault();
        }
    });
    mainWindow.on('closed', () => {
        if (consoleWindow) consoleWindow.close();
    });
    mainWindowState.manage(mainWindow);
    if (isDev) {
        require('electron-search-devtools').searchDevtools('REACT')
            .then((devtools: string) => {
                session.defaultSession.loadExtension(devtools, {
                    allowFileAccess: true,
                });
            }).catch((err: Error) => console.log(err));
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }

    global.consoleWindow = undefined;
    const consoleWindowState = windowStateKeeper({
        defaultWidth: 600,
        defaultHeight: 400
    });
    const showConsole = () => {
        if (!consoleWindow) {
            consoleWindow = new BrowserWindow({
                show: false,
                width: consoleWindowState.width,
                height: consoleWindowState.height,
                x: consoleWindowState.x,
                y: consoleWindowState.y,
                webPreferences: {
                    preload: path.join(__dirname, 'preload-console.js')
                }
            });
            consoleWindow.removeMenu();
            consoleWindow.loadFile('dist/console.html');
            consoleWindow.on('ready-to-show', () => consoleWindow?.show());
            consoleWindow.on('close', () => consoleWindow = undefined);
            consoleWindowState.manage(consoleWindow);
        }
        consoleWindow.focus();
    };
};

app.whenReady().then(createWindow);
app.once('window-all-closed', () => app.quit());