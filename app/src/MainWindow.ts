import {
    BrowserWindow, ipcMain, dialog
} from 'electron'

import * as path from "path";


export default class MainWindow{
    public browserWindow: BrowserWindow;
    constructor() {
        this.browserWindow = new BrowserWindow(
            {
                width: 450,
                height: 650,
                frame: false,
                titleBarStyle: 'hidden',
                transparent: true,
                icon: './app/app.ico',
                webPreferences: {
                    preload : path.join(__dirname, 'MainRender.js'),
                    nodeIntegration: true,
                    contextIsolation:true
                }
            }
        );
        this.browserWindow.loadFile('./frontend/index.html').then(r =>{} )
        this.browserWindow.on('close',  (ev) => {
            // ev.preventDefault();
            // this.browserWindow.hide();

        })
        ipcMain.handle('window:close', () => {
            this.browserWindow.hide()
        });

        ipcMain.handle('window:minimize', () => {
            this.browserWindow.minimize()
        });

        ipcMain.handle('win-open-dev-tools', () => {
            this.browserWindow.webContents.openDevTools();
        });

        ipcMain.handle('dialog:openFile', this.handleFileOpen)
    }



    public async  handleFileOpen() {
        let canceled: boolean, filePaths: string[];
        // @ts-ignore
        ({canceled, filePaths} = await dialog.showOpenDialog(
            null, {properties: ['openDirectory']}
        ));
        if (canceled) {
            return
        } else {
            return filePaths[0]
        }
    }

}


