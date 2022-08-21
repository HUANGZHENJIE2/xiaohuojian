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
load("titlebar")
load('controlpanel')
load('serverlist')
load('navbar')
load('statuspanel')