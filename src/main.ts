import path from 'path';
import { searchDevtools } from 'electron-search-devtools';
import { BrowserWindow, app, session } from 'electron';

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

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
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