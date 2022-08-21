import {contextBridge, ipcRenderer} from "electron";
import * as fs from 'fs'
import * as path from "path";
import * as child from "child_process";


// localStorage.

class myStorage {
    static getItem(name) {
        try {
            return JSON.parse(localStorage.getItem(name));
        } catch (e) {
            return null;
        }
    }

    static setItem(name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    }

}

function checkError(err) {
    if (err) {
        alert("文件访问失败");
        console.error(err)
    }
    return true;
}

function win32Start(xrayPath, configPath, sysproxyPath, config){
    // @ts-ignore
    let xrayProcess = child.exec(
        xrayPath + ' -c ' + configPath,
        function (err, stdout, stderr) {
            if (err) {
                console.error(err)
            }
            console.log(stdout);
            console.error(stderr);
        }
    );

    let sysproxyProcess = child.exec(
        sysproxyPath + ' global ' +
        '127.0.0.1:' +
        config.inbounds.find(inbound => inbound.protocol === 'http' && inbound.tag === 'localHttpProxy').port.toString() +
        ' "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*"',
        function (err, stdout, stderr) {
            if (err) {
                alert('子进程意外退出');
                console.error(err)
            }
            console.log(stdout);
            console.error(stderr);
        }
    );

    sysproxyProcess.on('error', function () {
        alert("Window 代理设置失败")
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    })

    xrayProcess.stdout.setEncoding('utf-8');

    xrayProcess.on('error', function () {
        alert("子进程意创建失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
        child.exec(sysproxyPath + ' set 1',
            function (err, stdout, stderr) {
                checkError(err);
                console.log(stdout);
                console.error(stderr);
            }
        );
    })

    xrayProcess.stdout.on('data', function (data) {
        console.log(data);
    })

    xrayProcess.stderr.on('data', function (data) {
        console.error(data);
    })

    xrayProcess.on('close', () => {
        child.exec(
            sysproxyPath + ' set 1',
            function (err, stdout, stderr) {
                if (!checkError(err)) {
                    console.error(err)
                    console.log(stdout);
                    console.error(stderr);
                    return
                }
                console.log(stdout);
                console.error(stderr);
            });

        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
}


function darwinStart(xrayPath, configPath, config){
    // @ts-ignore
    let xrayProcess = child.exec(
        xrayPath + ' -c ' + configPath,
        function (err, stdout, stderr) {
            if (err) {
                console.error(err)
            }
            console.log(stdout);
            console.error(stderr);
        }
    );

    let sysproxyProcess = child.exec(
        'networksetup  -setwebproxy Wi-Fi 127.0.0.1 ' +
        config.inbounds.find(inbound => inbound.protocol === 'http' && inbound.tag === 'localHttpProxy').port.toString() ,
        function (err, stdout, stderr) {
            if (err) {
                alert('子进程意外退出');
                console.error(err)
            }
            console.log(stdout);
            console.error(stderr);
        }
    );

    sysproxyProcess.on('error', function () {
        alert("Window 代理设置失败")
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    })

    xrayProcess.stdout.setEncoding('utf-8');

    xrayProcess.on('error', function () {
        alert("子进程意创建失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
        child.exec('networksetup -setwebproxystate Wi-Fi off',
            function (err, stdout, stderr) {
                checkError(err);
                console.log(stdout);
                console.error(stderr);
            }
        );
    })

    xrayProcess.stdout.on('data', function (data) {
        console.log(data);
    })

    xrayProcess.stderr.on('data', function (data) {
        console.error(data);
    })

    xrayProcess.on('close', () => {
        child.exec(
            'networksetup -setwebproxystate Wi-Fi off',
            function (err, stdout, stderr) {
                if (!checkError(err)) {
                    console.error(err)
                    console.log(stdout);
                    console.error(stderr);
                    return
                }
                console.log(stdout);
                console.error(stderr);
            });

        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
}
function darwinStop() {
    child.exec(
        'networksetup -setwebproxystate Wi-Fi off',
        function (err, stdout, stderr) {
            if (!checkError(err)) {
                console.error(err)
                console.log(stdout);
                console.error(stderr);
                return
            }
            console.log(stdout);
            console.error(stderr);
        });

    child.exec(
        'killall xray',
        function (err, stdout, stderr) {
            if (!checkError(err)) {
                console.error(err)
                console.log(stdout);
                console.error(stderr);
                return
            }
            console.log(stdout);
            console.error(stderr);
        });

}

window.addEventListener(
    'DOMContentLoaded', (event) => {

        let config = {
            "log": myStorage.getItem('log') || {},
            "api": {
                "tag": "api",
                "services": [
                    "StatsService"
                ]
            },
            "routing": {
                "domainStrategy": "IPIfNonMatch",
                "rules": [
                    {
                        "type": "field",
                        "inboundTag": [
                            "api"
                        ],
                        "outboundTag": "api"
                    }
                ]
            },
            "policy": {
                "system": {
                    "statsInboundUplink": true,
                    "statsInboundDownlink": true
                }
            },
            "inbounds": myStorage.getItem('inbounds'),
            "outbounds": myStorage.getItem('outbounds'),
            "stats": {},
        }

        let configPath = localStorage.getItem('configPath');
        if (!configPath){
            configPath = path.join(__dirname, Buffer.from('黄振杰').toString('hex'));
            localStorage.setItem('configPath', configPath)
        }

        // let xrayPath = path.join(__dirname, 'bin', 'xray.exe');

        let xrayPath = localStorage.getItem('xrayPath');
        if (!xrayPath){
            switch (process.platform) {
                case "win32":
                    xrayPath = path.join(__dirname, 'bin', 'xray.exe');
                    break;
                case "darwin":
                    xrayPath = path.join(__dirname, 'bin', 'xray');
                    break;
            }
            localStorage.setItem('xrayPath', xrayPath)
        }

        let sysproxyPath = localStorage.getItem('sysproxyPath');

        if (!sysproxyPath){
            sysproxyPath = path.join(__dirname, 'bin', 'sysproxy.exe');
            localStorage.setItem('sysproxyPath', sysproxyPath)
        }



        function start() {
            // @ts-ignore
            fs.writeFile(
                configPath, JSON.stringify(config), async function (err) {
                    if (!checkError(err)) {
                        return
                    }
                    switch (process.platform) {
                        case "win32":
                            win32Start(xrayPath, configPath, sysproxyPath, config)
                            break;
                        case "darwin":
                            darwinStart(xrayPath, configPath, config)
                            break;
                    }
                }
            )
        }


        function stop() {
            fs.unlink(
                configPath, function (err) {
                    if (!checkError(err)) {
                        return;
                    }
                    switch (process.platform) {
                        case "win32":
                            // @ts-ignore
                            child.exec(
                                sysproxyPath + ' set 1',
                                function (err, stdout, stderr) {
                                    if (!checkError(err)) {
                                        console.error(err)
                                        console.log(stdout);
                                        console.error(stderr);
                                        return
                                    }
                                    console.log(stdout);
                                    console.error(stderr);

                                    child.exec('taskkill /F /IM xray.exe',
                                        function (err, stdout, stderr) {
                                            checkError(err);
                                            console.log(stdout);
                                            console.error(stderr);
                                        }
                                    );
                                }
                            );
                            break;
                        case "darwin":
                            darwinStop()
                            break;
                    }
                }
            )
        }

        contextBridge.exposeInMainWorld('mainWindow', {
            close: () => ipcRenderer.invoke('window:close'),
            minimize: () => ipcRenderer.invoke('window:minimize'),
            openDevTools: () => ipcRenderer.invoke('win-open-dev-tools'),
            openFile: () => ipcRenderer.invoke('dialog:openFile'),
            start: () => start(),
            stop: () => stop(),
        });


    }
)

