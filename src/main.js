var debug = true;

var app = require("app");
var BrowserWindow = require("browser-window");
var path = require("path");
//const ipcMain = require('electron').ipcMain;


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on("ready", function () {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: true,
        icon: "./Icons/Filler.png"
    });
    // In the main process.
    global.sharedObject = {
        userData: app.getPath("userData")
    };


    mainWindow.webContents.on('did-finish-load', () => {
        var pjson = require('../package.json');
        console.log(pjson.version);
        mainWindow.setTitle(pjson.name + " version " + pjson.version);
    });
    mainWindow.loadURL("file://" + path.resolve(path.join(__dirname, "index.html")));

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    //  if (debug)
    //     mainWindow.openDevTools();
});

// Quit when all windows are closed.

 
