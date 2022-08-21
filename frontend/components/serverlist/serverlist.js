let serverlist = {
    serverList: document.querySelector('#serverList'),
    addServer: document.querySelector('#addServer'),
    serverModal: new bootstrap.Modal('#serverModal', {keyboard: false}),
    serverForm: document.querySelector('#serverForm')
}

let Servers = myStorage.getItem('serverList') || [];

serverlist.serverForm.addEventListener('submit', function (ev) {
    ev.preventDefault();
    let server = {};

    let inputs = serverlist.serverForm.querySelectorAll('input')
    for (let i = 0;  i < inputs.length; i++) {
        server[inputs[i].name] = inputs[i].value;
    }
    server.name = server.address +":"+ server.port;
    server.protocol = 'trojan';
    if (server.index && server.index !== ''){
        server.id = Servers[parseInt(server.index)].id;
        Servers[parseInt(server.index)] = server;
    }else {
        if (Servers.length === 0){
            server.id = 1;
        }else {
            server.id = Servers[Servers.length - 1].id + 1;
        }
        Servers.push(server)
    }
    serverlist.serverForm.querySelector('input[name="index"]').value = '';
    serverlist.serverForm.reset();
    myStorage.setItem('serverList', Servers);
    serverlist.serverModal.hide();
    renderServerList();
});


function renderServerList(){
    if (Servers.length > 0) {
        let html = ``
        for (let i = 0; i < Servers.length; i++) {
            let s = Servers[i] || {name: 's', address: "h", port: "p", protocol:'p'};
            html +=  `<li>
        <div class="left">
            <div class="serverlogo">
                <img src="./images/manger.png" width="20" alt="server">
            </div>
        </div>
        <div class="center">
            <div class="title">${s.name}</div>
            <div class="description">${s.protocol} ${s.address} ${s.port}</div>
        </div>
        <div class="right">
            <button class="moreMenu">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                     class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
                    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
            </button>
        </div>
    </li>`
        }
        serverlist.serverList.innerHTML = html;
    } else {
        serverlist.serverList.innerHTML = '<li class="justify-content-center text-muted">请添加服务器</li>'
    }
}

renderServerList()
serverlist.addServer.addEventListener('click', function () {
    serverlist.serverModal.show();
})


for (let li in serverlist.serverList.querySelectorAll('li')) {
    li.addEventListener('click', function () {
        li.classlist.add
    })
}
