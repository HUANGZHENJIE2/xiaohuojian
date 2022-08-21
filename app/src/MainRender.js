"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var fs = require("fs");
var path = require("path");
var child = require("child_process");
// localStorage.
var myStorage = /** @class */ (function () {
    function myStorage() {
    }
    myStorage.getItem = function (name) {
        try {
            return JSON.parse(localStorage.getItem(name));
        }
        catch (e) {
            return null;
        }
    };
    myStorage.setItem = function (name, value) {
        localStorage.setItem(name, JSON.stringify(value));
    };
    return myStorage;
}());
function checkError(err) {
    if (err) {
        alert("文件访问失败");
        console.error(err);
    }
    return true;
}
function win32Start(xrayPath, configPath, sysproxyPath, config) {
    // @ts-ignore
    var xrayProcess = child.exec(xrayPath + ' -c ' + configPath, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.error(stderr);
    });
    var sysproxyProcess = child.exec(sysproxyPath + ' global ' +
        '127.0.0.1:' +
        config.inbounds.find(function (inbound) { return inbound.protocol === 'http' && inbound.tag === 'localHttpProxy'; }).port.toString() +
        ' "localhost;127.*;10.*;172.16.*;172.17.*;172.18.*;172.19.*;172.20.*;172.21.*;172.22.*;172.23.*;172.24.*;172.25.*;172.26.*;172.27.*;172.28.*;172.29.*;172.30.*;172.31.*;192.168.*"', function (err, stdout, stderr) {
        if (err) {
            alert('子进程意外退出');
            console.error(err);
        }
        console.log(stdout);
        console.error(stderr);
    });
    sysproxyProcess.on('error', function () {
        alert("Window 代理设置失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
    xrayProcess.stdout.setEncoding('utf-8');
    xrayProcess.on('error', function () {
        alert("子进程意创建失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
        child.exec(sysproxyPath + ' set 1', function (err, stdout, stderr) {
            checkError(err);
            console.log(stdout);
            console.error(stderr);
        });
    });
    xrayProcess.stdout.on('data', function (data) {
        console.log(data);
    });
    xrayProcess.stderr.on('data', function (data) {
        console.error(data);
    });
    xrayProcess.on('close', function () {
        child.exec(sysproxyPath + ' set 1', function (err, stdout, stderr) {
            if (!checkError(err)) {
                console.error(err);
                console.log(stdout);
                console.error(stderr);
                return;
            }
            console.log(stdout);
            console.error(stderr);
        });
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
}
function darwinStart(xrayPath, configPath, config) {
    // @ts-ignore
    var xrayProcess = child.exec(xrayPath + ' -c ' + configPath, function (err, stdout, stderr) {
        if (err) {
            console.error(err);
        }
        console.log(stdout);
        console.error(stderr);
    });
    var sysproxyProcess = child.exec('networksetup  -setwebproxy Wi-Fi 127.0.0.1 ' +
        config.inbounds.find(function (inbound) { return inbound.protocol === 'http' && inbound.tag === 'localHttpProxy'; }).port.toString(), function (err, stdout, stderr) {
        if (err) {
            alert('子进程意外退出');
            console.error(err);
        }
        console.log(stdout);
        console.error(stderr);
    });
    sysproxyProcess.on('error', function () {
        alert("Window 代理设置失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
    xrayProcess.stdout.setEncoding('utf-8');
    xrayProcess.on('error', function () {
        alert("子进程意创建失败");
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
        child.exec('networksetup -setwebproxystate Wi-Fi off', function (err, stdout, stderr) {
            checkError(err);
            console.log(stdout);
            console.error(stderr);
        });
    });
    xrayProcess.stdout.on('data', function (data) {
        console.log(data);
    });
    xrayProcess.stderr.on('data', function (data) {
        console.error(data);
    });
    xrayProcess.on('close', function () {
        child.exec('networksetup -setwebproxystate Wi-Fi off', function (err, stdout, stderr) {
            if (!checkError(err)) {
                console.error(err);
                console.log(stdout);
                console.error(stderr);
                return;
            }
            console.log(stdout);
            console.error(stderr);
        });
        // @ts-ignore
        document.querySelector('#connectStatus').value = 0;
    });
}
function darwinStop() {
    child.exec('networksetup -setwebproxystate Wi-Fi off', function (err, stdout, stderr) {
        if (!checkError(err)) {
            console.error(err);
            console.log(stdout);
            console.error(stderr);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
    child.exec('killall xray', function (err, stdout, stderr) {
        if (!checkError(err)) {
            console.error(err);
            console.log(stdout);
            console.error(stderr);
            return;
        }
        console.log(stdout);
        console.error(stderr);
    });
}
window.addEventListener('DOMContentLoaded', function (event) {
    var config = {
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
    };
    var configPath = localStorage.getItem('configPath');
    if (!configPath) {
        configPath = path.join(__dirname, Buffer.from('黄振杰').toString('hex'));
        localStorage.setItem('configPath', configPath);
    }
    // let xrayPath = path.join(__dirname, 'bin', 'xray.exe');
    var xrayPath = localStorage.getItem('xrayPath');
    if (!xrayPath) {
        switch (process.platform) {
            case "win32":
                xrayPath = path.join(__dirname, 'bin', 'xray.exe');
                break;
            case "darwin":
                xrayPath = path.join(__dirname, 'bin', 'xray');
                break;
        }
        localStorage.setItem('xrayPath', xrayPath);
    }
    var sysproxyPath = localStorage.getItem('sysproxyPath');
    if (!sysproxyPath) {
        sysproxyPath = path.join(__dirname, 'bin', 'sysproxy.exe');
        localStorage.setItem('sysproxyPath', sysproxyPath);
    }
    function start() {
        // @ts-ignore
        fs.writeFile(configPath, JSON.stringify(config), function (err) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!checkError(err)) {
                        return [2 /*return*/];
                    }
                    switch (process.platform) {
                        case "win32":
                            win32Start(xrayPath, configPath, sysproxyPath, config);
                            break;
                        case "darwin":
                            darwinStart(xrayPath, configPath, config);
                            break;
                    }
                    return [2 /*return*/];
                });
            });
        });
    }
    function stop() {
        fs.unlink(configPath, function (err) {
            if (!checkError(err)) {
                return;
            }
            switch (process.platform) {
                case "win32":
                    // @ts-ignore
                    child.exec(sysproxyPath + ' set 1', function (err, stdout, stderr) {
                        if (!checkError(err)) {
                            console.error(err);
                            console.log(stdout);
                            console.error(stderr);
                            return;
                        }
                        console.log(stdout);
                        console.error(stderr);
                        child.exec('taskkill /F /IM xray.exe', function (err, stdout, stderr) {
                            checkError(err);
                            console.log(stdout);
                            console.error(stderr);
                        });
                    });
                    break;
                case "darwin":
                    darwinStop();
                    break;
            }
        });
    }
    electron_1.contextBridge.exposeInMainWorld('mainWindow', {
        close: function () { return electron_1.ipcRenderer.invoke('window:close'); },
        minimize: function () { return electron_1.ipcRenderer.invoke('window:minimize'); },
        openDevTools: function () { return electron_1.ipcRenderer.invoke('win-open-dev-tools'); },
        openFile: function () { return electron_1.ipcRenderer.invoke('dialog:openFile'); },
        start: function () { return start(); },
        stop: function () { return stop(); },
    });
});
//# sourceMappingURL=MainRender.js.map