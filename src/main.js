
'use strict';

const windowStateKeeper = require('electron-window-state');

//const debug=true;
const electron = require('electron')
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var path = require("path");
const fs = require('fs')
const os = require('os')
const ipc = electron.ipcMain
const shell = electron.shell
const dialog = require('electron').dialog

var mainWindow = null;
var printPDFWorkerWindow = null;
var process = require("process");
var size = null;

ipc.on("printPDF", function (even, content) {
    printPDFWorkerWindow.webContents.send("printPDF", content);
});
ipc.on("close-PDF-win", function (even, content) {
    try {
        printPDFWorkerWindow.close();
    } catch (ex) { }
});
ipc.on("quit", function (even, content) {

    app.quit();
});
ipc.on("run-test-script-done", function (even, content) {
    var allowRestart = true;
    //on restart remove any test scripts
    var argv = process.argv;
    var index = argv.indexOf("--runalltests");
    if (index > -1) allowRestart = false;// array.splice(index, 1);
    index = argv.indexOf("--runtestcarlog");
    if (index > -1) allowRestart = false;// array.splice(index, 1);
    index = argv.indexOf("--runtestabsence");
    if (index > -1) allowRestart = false;//array.splice(index, 1);
    index = argv.indexOf("--runresetdb");
    if (index > -1) allowRestart = false;// array.splice(index, 1);
    index = argv.indexOf("--runtestqm");
    if (index > -1) allowRestart = false;//array.splice(index, 1);
    index = argv.indexOf("--runresetall");
    if (index > -1) allowRestart = false;//array.splice(index, 1);
    if (allowRestart)
        app.relaunch() //{ args: argv });
    app.quit();
});
ipc.on("exportCSV", function (even, content) {
    dialog.showSaveDialog(
        {
            title: 'Export CSV',
            filters: [
                { name: 'CSV Files', extensions: ['csv'] }
            ]
        }
        , function (filename) {
            if (filename) {
                fs.writeFile(filename, content, function (error) {
                    if (error) {
                        throw error
                    }
                    shell.openExternal('file://' + filename)

                })
            }

        })
});

function savePDF(path) {
    if (!path) return;
    // Use default printing options

    printPDFWorkerWindow.webContents.printToPDF({}, function (error, data) {
        if (error) throw error
        fs.writeFile(path, data, function (error) {
            if (error) {
                throw error
            }
            shell.openExternal('file://' + path)
            //   ipc.send('wrote-pdf', path)
        })
    })
}

ipc.on('readyToPrintPDF', function (event) {

    dialog.showSaveDialog(
        {
            title: 'Save PDF',
            filters: [
                { name: 'PDFs', extensions: ['pdf'] }
            ]
        }
        , function (filename) {
            savePDF(filename);

        })

})


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
        'x': x,
        'y': y,
        fullScreen: true,
        maximize: true,
        file: "datachief/window-state.json"

    });

    mainWindow = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        show: true,
        icon: "./icons/Filler.png"
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
        userData: app.getPath("userData"),
        argv: process.argv,
        defaultApp: process.defaultApp
    };



    mainWindow.webContents.on('did-finish-load', () => {
        var pjson = require('../package.json');
        mainWindow.setTitle(pjson.name + " v" + pjson.version + ".");
    });

    mainWindow.loadURL("file://" + path.resolve(path.join(__dirname, "index.html"))); //+ (process.argv.indexOf("--dceditor")>0?"?editor":"" ))));

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
        printPDFWorkerWindow = null;
    });
    if (process.argv.indexOf("--opendevtools") > -1)
        mainWindow.openDevTools();

    // we need for printing PDF
    printPDFWorkerWindow = new BrowserWindow();
    printPDFWorkerWindow.loadURL("file://" + __dirname + "/printPDFWorkerWindow.html");
    printPDFWorkerWindow.hide();
    // printPDFWorkerWindow.webContents.openDevTools();
    printPDFWorkerWindow.on("closed", function () {
        printPDFWorkerWindow = null;
    });

}

