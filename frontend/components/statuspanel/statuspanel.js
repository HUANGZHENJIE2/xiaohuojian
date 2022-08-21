let StatusPanel = {
    log: {
        access: document.querySelector('#log_access'),
        error: document.querySelector('#log_error'),
        loglevel: document.querySelector('#log_level'),
        dnsLog: document.querySelector('#log_dnsLog'),
    },
    listen:{
        socket5ListenPort: document.querySelector('#socket5_listen_port'),
        httpListenPort: document.querySelector('#http_listen_port'),
        enableSniffing: document.querySelector('#enable_sniffing'),
        enableUDP: document.querySelector('#enable_udp')
    },
    connect: {
        enableMux: document.querySelector('#enable_mux'),
        allowInsecure: document.querySelector('#allowInsecure')
    },
    values: {
        access: document.querySelector('#log_values_access'),
        error: document.querySelector('#log_values_error'),
    }
}



let log = myStorage.getItem('log');

if (!log)
    setValues('log', {})

StatusPanel.values.access.textContent = log.access ? log.access.split("\\")[log.access.split("\\").length -2] : '未设置';
StatusPanel.values.access.title = log.access;
StatusPanel.values.error.textContent = log.error ? log.error.split("\\")[log.error.split("\\").length -2] : '未设置';
StatusPanel.values.error.title = log.error;
StatusPanel.log.loglevel.value = log.loglevel;
StatusPanel.log.dnsLog.checked = log.dnsLog;
function setValues(key, value) {
    log[key] = value;
    if(StatusPanel.values[key])
        StatusPanel.values[key].textContent = log[key];
    myStorage.setItem('log', log);
    log = myStorage.getItem('log')
}

StatusPanel.log.access.addEventListener('click', async function () {
    let path = await window.mainWindow.openFile();
    if (path)
        setValues('access', path + '\\' + 'access.log')
})

StatusPanel.log.error.addEventListener('click', async function () {
    let path = await window.mainWindow.openFile();
    if (path)
        setValues('error',  path + '\\' + 'error.log')
})

StatusPanel.log.loglevel.addEventListener('change', async function () {
    setValues('loglevel',  StatusPanel.log.loglevel.value)
})

StatusPanel.log.dnsLog.addEventListener('change', async function () {
    setValues('dnsLog',  StatusPanel.log.dnsLog.checked)
})




let inbounds = myStorage.getItem('inbounds');

if (!inbounds){
    inbounds = [
        {
            "listen": "127.0.0.1",
            "port": 1080,
            "protocol": "http",
            "settings": {
                "timeout:": 0,
                "allowTransparent": false,
                "userLevel": 0
            },
            "streamSettings": {},
            "sniffing": {
                "enabled": true,
                "destOverride": [
                    "http",
                    "tls"
                ]
            },
            "tag": "localHttpProxy",
        },
        {
            "tag": "localSocksProxy",
            "port": 1081,
            "listen": "127.0.0.1",
            "protocol": "socks",
            "settings": {
                "udp": true
            },
            "sniffing": {
                "enabled": true,
                "destOverride": [
                    "http",
                    "tls"
                ]
            },
        }
    ]
    myStorage.setItem('inbounds', inbounds);
}


StatusPanel.listen.socket5ListenPort.value = inbounds.find(inbound => inbound.tag === 'localSocksProxy').port;
StatusPanel.listen.httpListenPort.value = inbounds.find(inbound => inbound.tag === 'localHttpProxy').port;

StatusPanel.listen.socket5ListenPort.addEventListener('change', function () {
    inbounds.find(inbound => inbound.tag === 'localSocksProxy').port  = StatusPanel.listen.socket5ListenPort.value;
    myStorage.setItem('inbounds', inbounds)
})


StatusPanel.listen.httpListenPort.addEventListener('change', function () {
    inbounds.find(inbound => inbound.tag === 'localHttpProxy').port  = StatusPanel.listen.httpListenPort.value;
    myStorage.setItem('inbounds', inbounds)
})



StatusPanel.listen.enableSniffing.checked = inbounds.find(inbound => inbound.tag === 'localSocksProxy').sniffing.enabled;

StatusPanel.listen.enableSniffing.addEventListener('change', function () {
    inbounds.find(inbound => inbound.tag === 'localSocksProxy').sniffing.enabled  = StatusPanel.listen.enableSniffing.checked;
    inbounds.find(inbound => inbound.tag === 'localHttpProxy').sniffing.enabled  = StatusPanel.listen.enableSniffing.checked;
    myStorage.setItem('inbounds', inbounds)
})

console.log(inbounds.find(inbound => inbound.tag === 'localSocksProxy'))

StatusPanel.listen.enableUDP.checked = inbounds.find(inbound => inbound.tag === 'localSocksProxy').settings.udp;

StatusPanel.listen.enableUDP.addEventListener('change', function () {
    inbounds.find(inbound => inbound.tag === 'localSocksProxy').settings.udp  = StatusPanel.listen.enableUDP.checked;
    myStorage.setItem('inbounds', inbounds)
})


let outbounds =  myStorage.getItem('outbounds');

if(!outbounds){
    outbounds = [
        {
            "tag": "proxy",
            "protocol": "trojan",
            "settings": {
                "servers": [
                    {
                        "address": "hk.hzj.ac.cn",
                        "method": "chacha20",
                        "ota": false,
                        "password": "hzj123.*",
                        "port": 8090,
                        "level": 1
                    }
                ]
            },
            "streamSettings": {
                "network": "tcp",
                "security": "tls",
                "tlsSettings": {
                    "allowInsecure": false,
                    "serverName": "hk.hzj.ac.cn"
                }
            },
            "mux": {
                "enabled": false,
                "concurrency": -1
            }
        },
        {
            "tag": "direct",
            "protocol": "freedom",
            "settings": {}
        },
        {
            "tag": "block",
            "protocol": "blackhole",
            "settings": {
                "response": {
                    "type": "http"
                }
            }
        }
    ];
    myStorage.setItem('outbounds', outbounds);
}


StatusPanel.connect.enableMux.checked = outbounds.find(outbound => outbound.tag === 'proxy').mux.enabled;

StatusPanel.connect.enableMux.addEventListener('change', function () {
    outbounds.find(outbound => outbound.tag === 'proxy').mux.enabled  = StatusPanel.connect.enableMux.checked;
    if (StatusPanel.connect.enableMux.checked)
        outbounds.find(outbound => outbound.tag === 'proxy').mux.concurrency = 8;
    else
        outbounds.find(outbound => outbound.tag === 'proxy').mux.concurrency = -1;
    myStorage.setItem('outbounds', outbounds)
})

StatusPanel.connect.allowInsecure.checked = outbounds.find(outbound => outbound.tag === 'proxy').streamSettings.tlsSettings.allowInsecure;
StatusPanel.connect.allowInsecure.addEventListener('change', function () {
    outbounds.find(outbound => outbound.tag === 'proxy').streamSettings.tlsSettings.allowInsecure = StatusPanel.connect.allowInsecure.checked;
    myStorage.setItem('outbounds', outbounds)
})