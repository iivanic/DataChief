// helpers
var fs = require("fs");
var path = require("path");
var remote = require('remote'); 
var dialog = remote.require('dialog');
var pwd="P@s$w0Rd";
var crypto = require('crypto');
var cipher = crypto.createCipher('aes192', pwd);
var decipher = crypto.createDecipher('aes192', pwd);

this.generateGUID = function () {
    // not a real GUID, just a big random number
    // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
this.join = function(a,b)
{
    return path.resolve(path.join(a,b));
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
  checkFolderAndImpersonationFolder(p);

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
   checkFolderAndImpersonationFolder(p);

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
   checkFolderAndImpersonationFolder(p);

   return p;
};
this.getInboxPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"inbox");
   checkFolderAndImpersonationFolder(p);

   return p;
};
this.getPublishersPath = function () {
   var p = path.join(remote.getGlobal('sharedObject').userData,"datachief");
    try
   {
       fs.accessSync(p);
    }
    catch(e)
   {
        fs.mkdirSync(p);
   }
   p=path.join(p,"publishers");
   checkFolderAndImpersonationFolder(p);
   return p;
};
this.checkFolderAndImpersonationFolder = function(folder)
{
    
   try
   {
       fs.accessSync(folder);
    }
    catch(e)
   {
        fs.mkdirSync(folder);
   }
   return folder;
}
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
this.padNumber = function(number, size) {
      var s = String(number);
      while (s.length < (size || 2)) {s = "0" + s;}
      return s;
    } 
this.addNumberPrefix2File= function(p,filename)
{
  var maxFile = 0;
  var files =   this.getFilesInDir(p);
  for(var i in files)
  {
      var existingFileIndex=Math.abs(files[i].substr(0,5));
     if(existingFileIndex>maxFile)
     maxFile=existingFileIndex;
      
  }
  
  
  return path.join(p,this.padNumber(maxFile+1,5) + " " + filename);
}
this.moveFile = function(srcP, dstP)
{
    fs.renameSync(srcP, dstP);
}
this.getOnlyFileName= function(fileName)
{
    return path.basename(fileName)
}
this.deleteFile = function(fileName)
{
    fs.unlink(fileName)
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

this.confirm = function(message, callback)
{
     $("#dialog-confirm-text").text(message);
     $("#dialog-confirm").dialog({
                 resizable: false,
                height: 205,
                modal: true,
                 buttons: {     
                    Ok: function() {
                        $(this).dialog("close");
                        callback();
                    },
                      Cancel: function() {
                        $(this).dialog("close");
                    }
                }
            });
}

this.encrypt = function(text)
{
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
this.decrypt= function(encrypted)
{
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}