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
   return remote.getGlobal('sharedObject').userData;
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

this.getPrepublishPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"prepublish");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
     return p;
};
this.getPublishPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"publish");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   return p;
};
this.getOutboxPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"outbox");
  try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   return p;
};
this.getSentPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"sent");
   try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   return p;
};
this.getFilesInDir = function (p) {
  return fs.readdirSync(p);
};
this.ensureFileNameUnique= function(p,filename)
{
  var files =   this.getFilesInDir(p);
  for(var i in files)
  {
      if(files[i]==filename)
      {
        var cnt=0;
        do{
            var fn = path.basename(filename);
            var end = fn.lastIndexOf("_");
            if(end<0)
                end = fn.length;
            filename = fn.substr(0,end) + "_" + cnt.toString() + path.extname(filename) ;
            cnt++;
        } while(files[i]==filename)
      
        }   
  }
  
  return path.join(p,filename);
}
this.moveFile = function(srcP, dstP)
{
    fs.renameSync(srcP, dstP);
}
this.alert = function(message)
{
     $("#dialog-alert-text").text(message);
     $("#dialog-alert").dialog({
                resizable: false,
                height: 205,
                modal: true,
                buttons: {     
                    Ok: function() {
                        $(this).dialog("close");
                    }
                }
            });
}
// fs.renameSync(oldPath, newPath)

 
