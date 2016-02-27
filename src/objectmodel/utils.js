// helpers
var fs = require("fs");
var path = require("path");
var remote = require('remote'); 
var dialog = remote.require('dialog');


this.generateGUID = function () {
    // not a real GUID, just a big random number
    // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
this.loadTextFile = function (filename) {
   var data = fs.readFileSync(path.resolve(path.join(__dirname, filename)));
    return data.toString();
};
this.loadFile = function (filename) {
   var data = fs.readFileSync(filename);
   return data.toString();
};
this.fileExists = function(fileName){
    return path.existsSync(fileName);
}  
this.getUserFolder = function () {
   return require('remote').getGlobal('sharedObject').userData;
};
this.getUserSettingsFilePath = function ()
{
  return path.resolve(path.join(this.getUserFolder(),"datachiefUserSettings.json"));  
}
this.getCurrentUsername = function (filename) {

    var username = require('child_process').execSync("whoami", { encoding: 'utf8', timeout: 1000 });
    return String(username).trim();
};
this.saveTextFile = function (filename, content) {
    var fs = require('fs');
    fs.writeFile(filename, content, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file " + filename + " was saved!");
    });
}
this.openForm = function(callback){
    
    dialog.showOpenDialog(
        {   title: "Open DataChief form... " ,
            filters: [
            { name: 'DataChief Form', extensions: ['DataChiefForm'] },
            { name: 'All files', extensions: ['*'] },
    ]},
    function (fileName) {
        if (fileName === undefined) return;
            callback( fs.readFileSync(fileName[0]).toString() );
        });
       
}
this.loadFormBox = function () {
   var data = this.loadTextFile("../templates/formbox.html");
   return data.toString();
};
this.loadGroupBox = function () {
    var data = this.loadTextFile("../templates/groupbox.html");
   return data.toString();
};
 this.loadFieldBox = function () {
   var data = this.loadTextFile("../templates/fieldbox.html");
   return data.toString();
};
 
