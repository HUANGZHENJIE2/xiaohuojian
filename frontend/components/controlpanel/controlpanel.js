let controlpanel = {
    connect: document.querySelector('#connect'),
    connectStatus: document.querySelector('#connectStatus')
}

window.isStarted = false;
let servers = myStorage.getItem('serverList') || [];
controlpanel.connect.addEventListener('click', async function () {
    if(servers.length === 0){
        alert("请选择一个服务器")
        return
    }

    if (window.isStarted){
        controlpanel.connectStatus.value = "0"
        await window.mainWindow.stop();
        return
    }
    await window.mainWindow.start();
    controlpanel.connectStatus.value = "1"
})


setInterval(function () {
    if (controlpanel.connectStatus.value === '0'){
        controlpanel.connect.classList.remove('active')
        controlpanel.connect.textContent = '连接'
        window.isStarted = false;
        return
    }
    controlpanel.connect.classList.add('active')
    controlpanel.connect.textContent = '已连接'
    window.isStarted = true;
},1000)