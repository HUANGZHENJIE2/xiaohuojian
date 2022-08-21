"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var MainWindow_1 = require("./app/src/MainWindow");
var path = require("path");
electron_1.app.whenReady().then(function () {
    var main = new MainWindow_1.default();
    var icon = electron_1.nativeImage.createFromPath(path.join(__dirname, process.platform === 'win32' ? 'app.ico' : 'app.icns'));
    var tray = new electron_1.Tray(icon);
    var contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: '退出', click: function () {
                electron_1.app.exit();
            }
        }
    ]);
    tray.setToolTip('Rocket X');
    tray.setContextMenu(contextMenu);
    tray.on('click', function (e) {
        console.log("balloon-click");
        main.browserWindow.show();
    });
});
electron_1.app.on('activate', function () {
    if (electron_1.BrowserWindow.getAllWindows().length === 0)
        new MainWindow_1.default();
});
//# sourceMappingURL=main.js.map