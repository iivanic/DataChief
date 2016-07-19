
'use strict';

const windowStateKeeper = require('electron-window-state');
//let win;

//const debug=true;
var app = require("app");
var BrowserWindow = require("browser-window");
var path = require("path");
const electron = require('electron')

//const ipcMain = require('electron').ipcMain;
process = require("process");

app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});


app.on("ready", function () {

    var size = electron.screen.getPrimaryDisplay().workAreaSize

    let mainWindowState = windowStateKeeper({
        defaultWidth: size.width*0.9,
        defaultHeight: size.height*0.9,
        fullScreen: true
        });

    var mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        show: true,
        icon: "./Icons/Filler.png"
    });
   
    if(mainWindow.isMaximized==undefined )
        mainWindow.maximize();

    // In the main process.

    global.sharedObject = {
        userData: app.getPath("userData")
    };


    mainWindow.webContents.on('did-finish-load', () => {
        var pjson = require('../package.json');
        console.log(pjson.version);
        mainWindow.setTitle(pjson.name + " version " + pjson.version);
    });

    mainWindow.loadURL("file://" + path.resolve(path.join(__dirname, "index.html"))); //+ (process.argv.indexOf("--dceditor")>0?"?editor":"" ))));

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    //   if (debug)
    //      mainWindow.openDevTools();

    // Let us register listeners on the window, so we can update the state 
    // automatically (the listeners will be removed when the window is closed) 
    // and restore the maximized or full screen state 
    mainWindowState.manage(mainWindow);
});

// Quit when all windows are closed.


