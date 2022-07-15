import path from 'path';
import fs from 'fs';
import { copySync } from 'fs-extra';
import { BrowserWindow, app, session, ipcMain, dialog } from 'electron';
import type { Readable } from 'stream';
import properties from './properties';
import ServerController from './ServerController';
import windowStateKeeper from 'electron-window-state';
import { Profiles, versions } from './@types/global';

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

const appDataPath = path.join(app.getPath('appData'), 'MinecraftServerManager');
const profilePath = path.join(appDataPath, 'profiles.json');

const ServerVersions: { [key: string]: string } = {
    '1.19': 'https://launcher.mojang.com/v1/objects/e00c4052dac1d59a1188b2aa9d5a87113aaf1122/server.jar',
    '1.18.2': 'https://launcher.mojang.com/v1/objects/c8f83c5655308435b3dcf03c06d9fe8740a77469/server.jar',
    '1.16.5': 'https://launcher.mojang.com/v1/objects/1b557e7b033b583cd9f66746b7a9ab1ec1673ced/server.jar',
    '1.12.2': 'https://launcher.mojang.com/v1/objects/886945bfb2b978778c3a0288fd7fab09d315b25f/server.jar'
};

const createLauncherWindow = () => {
    const launcherWindowState = windowStateKeeper({
        defaultWidth: 500,
        defaultHeight: 500,
        file: 'launcher-window-state.json'
    });
    const launcherWindow = new BrowserWindow({
        show: false,
        width: launcherWindowState.width,
        height: launcherWindowState.height,
        x: launcherWindowState.x,
        y: launcherWindowState.y,
        webPreferences: {
            preload: path.join(__dirname, 'preload-launcher.js')
        }
    });
    launcherWindow.removeMenu();
    launcherWindow.loadFile(path.join(__dirname, 'launcher.html'));
    launcherWindow.once('ready-to-show', () => launcherWindow.show());
    launcherWindowState.manage(launcherWindow);
    ipcMain.handle('getProfiles', () => {
        return getProfiles();
    });
    ipcMain.on('setProfiles', (_, profiles: Profiles) => {
        setProfiles(profiles);
    });
    ipcMain.handle('showFolderSelector', async () => {
        const result = await dialog.showOpenDialog(launcherWindow, { properties: ['openDirectory'] });
        return result.filePaths[0];
    });
    ipcMain.on('launch', (_, profileId: string) => {
        ipcMain.removeAllListeners();
        createMainWindow(profileId);
        launcherWindow.close();
    });
};

const createMainWindow = (profileId: string) => {
    const profiles = getProfiles();
    const ServerPath = profiles[profileId].path;
    const jarPath = path.join(ServerPath, 'server.jar');
    const eulaPath = path.join(ServerPath, 'eula.txt');
    const propertiesPath = path.join(ServerPath, 'server.properties');
    const logPath = path.join(ServerPath, 'server.log');
    const backupPath = path.join(ServerPath, 'backup');
    const worldPath = path.join(ServerPath, 'world');

    const mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800,
        file: 'main-window-state.json'
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
        }
    });
    mainWindow.removeMenu();
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.once('ready-to-show', () => mainWindow.show());
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
        consoleWindow?.close();
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

    ipcMain.handle('isInstalled', async () => {
        return fs.existsSync(eulaPath) && /eula=true/.test(fs.readFileSync(eulaPath).toString());
    });
    ipcMain.handle('install', async (_, version: versions) => {
        try {
            const axios = (await import('axios')).default;
            const child_process = await import('child_process');
            if (!fs.existsSync(ServerPath)) fs.mkdirSync(ServerPath);
            const { data } = await axios.get<Readable>(
                ServerVersions[version],
                { responseType: 'stream' }
            );
            data.pipe(fs.createWriteStream(jarPath));
            return await new Promise<boolean>((resolve) => {
                data.on('error', () => resolve(false));
                data.on('end', () => {
                    child_process.execSync(`cd ${ServerPath} && java -jar server.jar`);
                    profiles[profileId].version = version;
                    setProfiles(profiles);
                    resolve(true);
                });
            });
        } catch (e) {
            console.log(e);
            dialog.showErrorBox('インストールエラー', (e as Error).toString());
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
    const serverController = new ServerController(ServerPath, logPath);
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
    ipcMain.handle('getBackups', () => {
        return getBackups(backupPath);
    });
    ipcMain.handle('createBackup', () => {
        if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);
        const backup = (new Date()).getTime().toString();
        if (fs.existsSync(path.join(backupPath, backup))) return false;
        try {
            copySync(worldPath, path.join(backupPath, backup));
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    });
    ipcMain.handle('deleteBackup', (_, backup: number) => {
        try {
            fs.rmSync(path.join(backupPath, backup.toString()), { recursive: true, force: true });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    });
    ipcMain.handle('restore', (_, backup: number) => {
        if (serverController.isRunning) return false;
        if (!fs.existsSync(path.join(backupPath, backup.toString()))) return false;
        try {
            fs.rmSync(worldPath, { recursive: true, force: true });
            copySync(path.join(backupPath, backup.toString()), worldPath);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    });
    ipcMain.on('command', (_, text: string) => {
        serverController.command(text);
    });


    global.consoleWindow = undefined;
    const consoleWindowState = windowStateKeeper({
        defaultWidth: 600,
        defaultHeight: 400,
        file: 'console-window-state.json'
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
            consoleWindow.loadFile(path.join(__dirname, 'console.html'));
            consoleWindow.once('ready-to-show', () => {
                consoleWindow?.show();
                consoleWindow?.focus();
                if (fs.existsSync(logPath)) consoleWindow?.webContents.send('data', fs.readFileSync(logPath, 'utf-8'));
            });
            consoleWindow.on('close', () => consoleWindow = undefined);
            consoleWindowState.manage(consoleWindow);
        } else {
            consoleWindow.focus();
        }
    };
};

const getProfiles = () => {
    if (!fs.existsSync(profilePath)) {
        fs.writeFileSync(profilePath, '{}');
        return {};
    }
    return JSON.parse(fs.readFileSync(profilePath, 'utf-8')) as Profiles;
};
const setProfiles = (profiles: Profiles) => {
    fs.writeFileSync(profilePath, JSON.stringify(profiles), 'utf-8');
};
const getBackups = (backupPath: string) => {
    if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);
    const entries = fs.readdirSync(backupPath, { withFileTypes: true });
    const backups = [];
    for (const entry of entries) {
        if (entry.isDirectory()) {
            backups.push(parseInt(entry.name));
        }
    }
    backups.sort((a, b) => b - a);
    return backups;
};

app.whenReady().then(createLauncherWindow);
app.once('window-all-closed', () => app.quit());