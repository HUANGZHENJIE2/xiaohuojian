import {
    app,
    Menu,
    BrowserWindow,
    Tray,
    nativeImage
} from 'electron'
import MainWindow from "./app/src/MainWindow";
import * as path from "path";



app.whenReady().then(
    ()=>{
        let main = new MainWindow();

        const icon = nativeImage.createFromPath(path.join( __dirname, process.platform ==='win32'?'app.ico': 'app.icns'))

        let tray = new Tray(icon)
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '退出', click: () =>{
                    app.exit();
                }
            }
        ]);

        tray.setToolTip('Rocket X')
        tray.setContextMenu(contextMenu)
        tray.on('click',function (e) {
            console.log("balloon-click")
            main.browserWindow.show();
        });
    }
)



app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) new MainWindow()
})