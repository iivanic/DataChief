// helpers
var fs = require("fs");
var path = require("path");
var remote = require('remote');
var dialog = remote.require('dialog');
var pwd = "P@s$w0Rd";
var crypto = require('crypto');

this.generateGUID = function () {
    // not a real GUID, just a big random number
    // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
this.join = function (a, b) {
    return path.join(a, b); //path.resolve(
}
this.loadTextFile = function (filename) {
    var data = fs.readFileSync(path.resolve(path.join(__dirname, filename)));
    return data.toString();
};
this.loadFile = function (filename) {
    var data = fs.readFileSync(filename);
    return data.toString();
};
this.fileExists = function (fileName) {
    return path.existsSync(fileName);
}
this.getSettingsFolder = function () {
    var p = path.join(remote.getGlobal('sharedObject').userData, "datachief");
    try {
        fs.accessSync(p);
    }
    catch (e) {
        fs.mkdirSync(p);
    }
    return p
};
this.getUserSettingsFilePath = function () {
    return path.resolve(path.join(this.getSettingsFolder(), "datachiefUserSettings.json"));
}
this.getIdentitySettingsFilePath = function (email) {
    return path.resolve(this.getIdentityFolder(email), "datachiefIdentitySettings.json");
}
this.getIdentityFolder = function (email) {
    return path.join(this.checkFolderAndImpersonationFolder(this.getSettingsFolder(), email));
}
this.getCurrentUsername = function (filename) {
    var username = require('child_process').execSync("whoami", { encoding: 'utf8', timeout: 1000 });
    username = username.replace('\n', '').replace('\r', '').replace('\v', '').split('\\');
    username = username[username.length - 1] + "@" + require("os").hostname().toLowerCase();
    return String(username).trim();
};
this.saveTextFile = function (filename, content) {
    var fs = require('fs');
    fs.writeFileSync(filename, content);
    console.log("The file " + filename + " was saved!");

}
this.openForm = function (callback) {

    dialog.showOpenDialog(
        {
            title: "Open DataChief form... ",
            filters: [
                { name: 'DataChief Form', extensions: ['DataChiefForm'] },
                { name: 'All files', extensions: ['*'] },
            ]
        },
        function (fileName) {
            if (fileName === undefined) return;
            callback(fs.readFileSync(fileName[0]).toString());
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
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "prepublish");
    p = this.checkFolder(p);
    return p;
};
this.getPublishPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "publish");
    p = this.checkFolder(p);
    return p;
};
this.getOutboxPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "outbox");
    p = this.checkFolder(p);
    return p;
};
this.getInboxPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "inbox");
    p = this.checkFolder(p);
    return p;
};
this.getWorkPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "work");
    p = this.checkFolder(p);
    return p;
};
this.getRecievedPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "recieved");
    p = this.checkFolder(p);
    return p;
};
this.getPublishersPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "publishers");
    p = this.checkFolder(p);
    return p;
};
this.getSentPath = function () {
    var p = this.getSettingsFolder();
    this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "sent");
    p = this.checkFolder(p);
    return p;
};
this.checkFolderAndImpersonationFolder = function (folder, email) {
    if (!email) {
        email = userSettings.email;
    }
    folder = path.join(folder, email);
    try {
        fs.accessSync(folder);
    }
    catch (e) {
        fs.mkdirSync(folder);
    }
    return folder;
}
this.checkFolder = function (folder) {

    try {
        fs.accessSync(folder);
    }
    catch (e) {
        fs.mkdirSync(folder);
    }
    return folder;
}

this.getFilesInDir = function (p) {
    return fs.readdirSync(p);
};
this.getDirectories = function (p) {
    return fs.readdirSync(p).filter(function (file) {
        return fs.statSync(path.join(p, file)).isDirectory();
    });
}
this.padNumber = function (number, size) {
    var s = String(number);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
}
this.addNumberPrefix2File = function (p, filename) {
    var maxFile = 0;
    var files = this.getFilesInDir(p);
    for (var i in files) {
        var existingFileIndex = Math.abs(files[i].substr(0, 5));
        if (existingFileIndex > maxFile)
            maxFile = existingFileIndex;

    }


    return path.join(p, this.padNumber(maxFile + 1, 5) + " " + filename);
}
this.moveFile = function (srcP, dstP) {
    fs.renameSync(srcP, dstP);
}
this.getOnlyFileName = function (fileName) {
    return path.basename(fileName)
}
this.deleteFile = function (fileName) {
    fs.unlinkSync(fileName)
}
this.deleteFolder = function (path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

this.alert = function (message) {
    $("#dialog-alert-text").text(message);
    $("#dialog-alert").dialog({
        resizable: false,
        height: 205,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
            }
        }
    });
}

this.confirm = function (message, callback) {
    $("#dialog-confirm-text").text(message);
    $("#dialog-confirm").dialog({
        resizable: false,
        height: 205,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
                callback();
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

this.encrypt = function (text, additionalpassword) {
    //   return text;
    var cipher = crypto.createCipher('aes192', pwd + (additionalpassword ? additionalpassword : ""));
    var encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}
this.decrypt = function (encrypted, additionalpassword) {
    //  return encrypted;
    var decipher = crypto.createDecipher('aes192', pwd + (additionalpassword ? additionalpassword : ""));

    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

this.log = function (txt) {
    var d = new Date();
    $("#logList").append((userSettings.email != userSettings.mainEmail ? userSettings.mainEmail + " impersonating " : "") + userSettings.email + " - " + this.padNumber(d.getHours(), 2) + ":" + this.padNumber(d.getMinutes(), 2) + ":" + this.padNumber(d.getSeconds(), 2) + " > " + txt + "<br>");
    //  $("#logList").scrollTop($("#logList").scrollHeight);
    $("#logList").animate({ scrollTop: $("#logList")[0].scrollHeight }, 200);
}

//checks weather roles comply with required roles
this.checkUser = function (userRoles, requiredRoles) {
    //nothing is required
    if (!requiredRoles)
        return true;
    //no credentials
    if (!userRoles)
        return false;

    // parameters can be either string(s) or array(s)
    // if both are strings
    if (!(userRoles instanceof Array) && !(requiredRoles instanceof Array)) {
        // strings can be lists delimited with comma
        var req = requiredRoles.split(",");
        var usr = userRoles.split(",");
        for (var i in req)
            for (var j in usr)
                if (req[i].toLowerCase().trim() == usr[j].toLowerCase().trim())
                    return true;

        return false;

    }
    else {
        // requiredRoles are array, and userroles are not
        if ((requiredRoles instanceof Array) && !(userRoles instanceof Array)) {
            for (var i in requiredRoles) {
                if (requiredRoles[i].toLowerCase().trim() == userRoles.toLowerCase().trim())
                    return true;
            }
        }
        else {
            // userroles are array, and requiredRoles are not
            if (!(requiredRoles instanceof Array) && (userRoles instanceof Array)) {
                for (var i in userRoles) {
                    if (userRoles[i].toLowerCase().trim() == requiredRoles.toLowerCase().trim())
                        return true;
                }
            }
            else {
                // both userroles and requiredRoles are arrays, we are looking only for one match
                if ((requiredRoles instanceof Array) && (userRoles instanceof Array)) {
                    for (var i in userRoles) {
                        for (var j in requiredRoles) {
                            if (userRoles[i].toLowerCase().trim() == requiredRoles[j].toLowerCase().trim())
                                return true;
                        }
                    }
                }

            }
        }
        return false;
    }
}
this.extractUser = function (user) {
    var usr = user.split(",");
    for (var i in usr) {
        if (usr[i].toLowerCase().trim() != "initiator")
            return usr[i].toLowerCase().trim();
    }
}