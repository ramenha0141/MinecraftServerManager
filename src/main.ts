import path from 'path';
import fs from 'fs';
import axios from 'axios';
import child_process from 'child_process';
import { BrowserWindow, app, session, ipcMain } from 'electron';
import { Readable } from 'stream';
import properties from './properties';
import ServerController from './ServerController';

const isDev = process.env.NODE_ENV === 'development';

if (require('electron-squirrel-startup')) app.quit();

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

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true
        },
    });
    ipcMain.handle('isInstalled', async () => {
        return fs.existsSync(eulaPath) && fs.readFileSync(eulaPath).toString() === 'eula=true\n';
    });
    ipcMain.handle('install', async () => {
        try {
            if (fs.existsSync(ServerPath)) fs.rmdirSync(ServerPath, { recursive: true });
            fs.mkdirSync(ServerPath);
            const  { data } = await axios.get<Readable>(
                'https://launcher.mojang.com/v1/objects/e00c4052dac1d59a1188b2aa9d5a87113aaf1122/server.jar',
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
    const serverCOntroller = new ServerController(ServerPath);
    ipcMain.handle('start', async () => {
        return await serverCOntroller.start();
    });
    ipcMain.handle('stop', async () => {
        return await serverCOntroller.stop();
    });
    ipcMain.on('showPerformanceWindow', () => {

    });
    ipcMain.on('showLogWindow', () => {

    });
    ipcMain.handle('getConfig', () => {
        return properties.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    });
    ipcMain.on('setConfig', (_, config: {[key: string]: string}) => {
        fs.writeFileSync(propertiesPath, properties.stringify(config));
    });
    mainWindow.removeMenu();
    mainWindow.loadFile('dist/index.html');
    mainWindow.on('ready-to-show', () => mainWindow.show());
    if (isDev) {
        require('electron-search-devtools').searchDevtools('REACT')
            .then((devtools: string) => {
                session.defaultSession.loadExtension(devtools, {
                    allowFileAccess: true,
                });
            }).catch((err: Error) => console.log(err));
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
};

app.whenReady().then(createWindow);
app.once('window-all-closed', () => app.quit());