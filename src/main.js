
'use strict';

const windowStateKeeper = require('electron-window-state');

//const debug=true;
const electron = require('electron')
var app = electron.app;
var BrowserWindow =electron.BrowserWindow;
var path = require("path");

var mainWindow = null;
var process = require("process");
var size = null;


app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// OSX only callback - takes care of spawning
// a new app window if needed
app.on('activate', function () {
    if (mainWindow == null) {
       ready();     
    }
});

app.on("ready", function () {
    ready();
});

function ready() {
  
    size = electron.screen.getPrimaryDisplay().workAreaSize;
    var x = Math.trunc(size.width * 0.05);
    var y = Math.trunc(size.height * 0.05);
    let mainWindowState = windowStateKeeper({
        defaultWidth: Math.trunc(size.width * 0.9),
        defaultHeight: Math.trunc(size.height * 0.9),
        'x':  x,
        'y':  y,
        fullScreen: true,
        maximize : true

    });

    mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        show: true,
        icon: "./Icons/Filler.png"
    });

    // Let us register listeners on the window, so we can update the state 
    // automatically (the listeners will be removed when the window is closed) 
    // and restore the maximized or full screen state 
    mainWindowState.manage(mainWindow);
    
 //   if (mainWindow.isMaximized() == undefined || mainWindow.isMaximized() == null)
  //      mainWindow.maximize();

    if (mainWindow.isMaximized() == undefined || mainWindow.isMaximized() == null)
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



}

