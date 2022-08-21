function loadJs(src) {
    return new Promise( (resolve, reject) => {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = () => {
            resolve();
        }
        script.onerror = () =>{
            reject();
        }
        script.src = src;
        document.body.appendChild(script);
    })
}

function loadCss(src) {
    return new Promise( (resolve, reject) => {
        let link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = src;
        // href="bootstrap/css/bootstrap.min.css" rel="stylesheet"
        link.onload = () => {
            resolve();
        }
        link.onerror = () =>{
            reject();
        }
        document.body.appendChild(link);
    })
}

function load(name) {
    loadJs('./components/' + name + "/" + name + ".js").then(r =>{
      console.log(name + " js")
    })

    loadCss('./components/' + name + "/" + name + ".css").then(r =>{
        console.log(name + " css")
    })
}