var debug = true;

var app = require("app");
var BrowserWindow = require("browser-window");
var path = require("path");

app.on("ready", function () {
    var mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: true,
        icon: "./Icons/Filler.png"
    });

    mainWindow.webContents.on('did-finish-load', () => {
        var pjson = require('../package.json');
        console.log(pjson.version);
        mainWindow.setTitle(pjson.name + " version " + pjson.version);
    });
    mainWindow.loadURL("file://" + path.resolve(path.join(__dirname, "index.html")));

  //  if (debug)
   //     mainWindow.openDevTools();
})
   
 
