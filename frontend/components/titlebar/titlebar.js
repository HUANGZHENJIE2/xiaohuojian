let titlebar = {
    close : document.querySelector('#close'),
    minimize: document.querySelector('#minimize'),
    devTools: document.querySelector('#devTools')
}


window.mainWindow = window || {};
titlebar.close.addEventListener('click', function () {
    window.mainWindow.close();
});

titlebar.minimize.addEventListener('click', function () {
    window.mainWindow.minimize();
});

titlebar.devTools.addEventListener('click', function () {
    window.mainWindow.openDevTools();
});