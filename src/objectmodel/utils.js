// helpers
var fs = require("fs");
var path = require("path");
var remote = require('electron').remote;
var dialog = remote.dialog;
var pwd = "P@s$w0Rd";
var crypto = require('crypto');
var tests = new Array();

this.generateGUID = function () {
    // not a real GUID, just a big random number
    // taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
var testObjects = new Array();
var prepareCallsCount = 0;
var firsttest = null;
var oldtest = null;
this.checkCommandLineAgain = function (param) {
    testsParsed = false;
    testObjects = new Array();
    tests = new Array();
    prepareCallsCount = 0;
    firsttest = null;
    oldtest = null;
    this.checkCommandLine(param);
}
this.sleep = function(milisecondsms)
{
    {
        var currentTime = new Date().getTime();
     
        while (currentTime + miliseconds >= new Date().getTime()) {
        }
     }
}
this.checkCommandLine = function (param) {

    if (this.isAnyTest(param)) {
        this.log("Found " + (tests.length + 1) + "test(s).");


        for (var i = 0 in tests) {
            this.log("Loading test script: " + tests[i]);
            var test = require(helper.join(helper.join(__dirname, ".."), helper.join("testscripts", tests[i])));
            testObjects.push(test);
            if (!firsttest)
                firsttest = test;
            if (oldtest) {
                oldtest.doneCallback = test.runTest;
                oldtest.next = test;
            }
            oldtest = test;
        }

        //open log panel at bottom
        $("#expandlog").click();
        // set user to first on the list, this is the user not in barrique Case study
        $("#selectActiveProfile").prop("selectedIndex", 0).selectmenu("refresh");
        userSettings.activeProfile_change();

        helper.log("User switched to " + userSettings.identitySetting.email);
        helper.log("Welcome to TEST. Please DO NOT TOUCH ANYTHING while test is running.");
        helper.log("Case Study and Designer mode " + (caseStudyAndEditorNeeded ? "ARE" : "ARE NOT") + " needed.");
        if (caseStudyAndEditorNeeded) {
            if (!barrique.isInstalled()) {
                var msg = "BarriqueWorks case study users not installed. Install them and run test again.";
                helper.log(msg);
                helper.alert(msg);
                return;
            }
            else {
                helper.log("OK - BarriqueWorks case study users found.");
            }
            helper.log("Checking for design mode.");
            if (userSettings.clientOnly) {
                var msg = "No design mode detected. Please install DataChief in Design mode.";
                helper.log(msg);
                helper.alert(msg);
                return;
            }
            else {
                //activate editor
                $(maintabs).tabs("option", "active", 0);
                $(maintabs).tabs("refresh");
                helper.log("OK - Design mode detected.");

            }
        }


        oldtest.doneCallback = this.testsDone;
        prepareCallsCount = 0;
        helper.alert("Running test script. Please Wait.");
        testObjects[prepareCallsCount].prepare(this.prepareForTestDone);

    }
}
this.prepareForTestDone = function () {
    helper.log("Prepare for " + tests[prepareCallsCount] + " done.");
    prepareCallsCount++;
    if (prepareCallsCount == testObjects.length) {
        oldtest.publish(helper.publishDone);
    }
    else {
        testObjects[prepareCallsCount].prepare(helper.prepareForTestDone);
    }

}
this.publishDone = function () {
    helper.log("Publish for " + tests[prepareCallsCount - 1] + " done.");
    firsttest.runTest();

}
this.testsDone = function () {
    helper.log("TEST(S) finished.");
    helper.log("Sending QUIT signal.");
    var ipc = require('electron').ipcRenderer;
    ipc.send("run-test-script-done");
    //  ipc.send("quit");
}
var testsParsed = false;
var caseStudyAndEditorNeeded = false;
var lastTestScriptFromApp = null;
this.isAnyTest = function (param) {
    if (!testsParsed) {
        var arguments = null;
        if (param) {
            arguments = param;
            lastTestScriptFromApp = param;
        }
        else {
            var remote = require('electron').remote;
            arguments = remote.getGlobal('sharedObject').argv;
        }

        for (var i in arguments) {
            switch (arguments[i].toLowerCase()) {
                case "--runtestcarlog":
                    tests.push("testcarlog.js");
                    caseStudyAndEditorNeeded = true;
                    break;
                case "--runtestabsence":
                    tests.push("testabsence.js");
                    caseStudyAndEditorNeeded = true;
                    break;
                case "--runresetdb":
                    tests.push("testresetdb.js");
                    break;
                case "--runtestqm":
                    tests.push("testqm.js");
                    caseStudyAndEditorNeeded = true;
                    break;
                case "--runalltests":
                    tests.push("testresetdb.js");
                    tests.push("testcarlog.js");
                    tests.push("testabsence.js");
                    tests.push("testqm.js");
                    caseStudyAndEditorNeeded = true;
                    break;
                case "--runresetall":
                    tests.push("testresetdb.js");
                    tests.push("testresetall.js");
            }
        }
        testsParsed = true;
    }
    return tests.length > 0;
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
    try {
        fs.statSync(fileName);
    } catch (err) {
        if (err.code == 'ENOENT') return false;
    }
    return true;
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
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "sent");
    p = this.checkFolder(p);
    return p;
};
this.getMyOutboxPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "myoutbox");
    p = this.checkFolder(p);
    return p;
};
this.getReadyPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "ready");
    p = this.checkFolder(p);
    return p;
};
this.getDataBasePath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "database");
    p = this.checkFolder(p);
    return p;
};
this.getRecievedBroadCastsPath = function () {
    var p = this.getSettingsFolder();
    p = this.checkFolderAndImpersonationFolder(p);
    p = path.join(p, "recievedbroadcasts");
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
this.copyFile = function (srcP, dstP) {
    fs.copyFileSync(srcP, dstP);
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
                helper.deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

this.alert = function (message, callback, html, width_, height_) {
    if (html)
        $("#dialog-alert-text").html(message);
    else
        $("#dialog-alert-text").text(message);
    if (!width_)
        width_ = 500;
    if (!height_)
        height_ = 355;
    $("#dialog-alert").dialog({
        resizable: false,
        height: height_,
        width: width_,
        modal: true,
        zIndex: 10001,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
                if (callback)
                    callback();
            }
        }
    });
    //$( "#dialog-alert" ).parent().css('z-Index',100001);
    $("#dialog-alert").dialog("moveToTop");

}

this.confirm = function (message, callback, param) {
    $("#dialog-confirm-text").text(message);
    $("#dialog-confirm").dialog({
        resizable: false,
        height: 355,
        width: 500,
        modal: true,
        buttons: {
            Ok: {
                text: "Ok",
                id: "dialog-confirm-ok",
                click: function () {
                    $(this).dialog("close");
                    callback(param);
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
    try {
        //if alert is open, keep it on top
        $("#dialog-alert").dialog("moveToTop");
    }
    catch (ex) { }
}

this.input = function (message, callback, _regexp, param1, param2) {
    $("#dialog-input-text").text(message);
    $("#dialog-input").dialog({
        resizable: false,
        height: 230,
        width: 500,
        modal: true,
        buttons: {
            Ok: function () {
                $(this).dialog("close");
                if (_regexp.test($("#dialog-input-inputedtext").val()))
                    callback(param1, $("#dialog-input-inputedtext").val());
                else
                    helper.alert("Input not valid.");
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
    try {
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
    }
    catch (e) {
        helper.alert("Decryption Error. Are You sure your secret is set correctly?")
    }
    return decrypted;
}

this.log = function (txt) {
    var d = new Date();
    var str = (userSettings.email != userSettings.mainEmail ? userSettings.mainEmail + " impersonating " : "") + userSettings.email + " - " + this.padNumber(d.getHours(), 2) + ":" + this.padNumber(d.getMinutes(), 2) + ":" + this.padNumber(d.getSeconds(), 2) + " > " + txt;
    $("#logList").append(str + "<br>");
    //  $("#logList").scrollTop($("#logList").scrollHeight);
    $("#logList").animate({ scrollTop: $("#logList")[0].scrollHeight }, 10);

    if ($("#IMAPTestDialogLog")) {
        if ($("#IMAPTestDialog").is(":visible"))
            $("#IMAPTestDialogLog").append("<option>" + str + "</option>")
    }

}
this.formatDateForFileName = function (d) {
    if (!(d instanceof Date))
        d = new Date(d);
    return helper.padNumber(d.getMonth().toString(), 2) +
        "-" + helper.padNumber(d.getDay().toString(), 2) +
        "-" + d.getFullYear().toString() +
        "-" + helper.padNumber(d.getHours().toString(), 2) +
        "-" + helper.padNumber(d.getMinutes().toString(), 2) +
        "-" + helper.padNumber(d.getSeconds().toString(), 2);
}
this.parseDateFromFileName = function (str) {
    var datePart = str.split("-")

    return new Date(datePart[2], datePart[0], datePart[1], datePart[3], datePart[4], datePart[5]);


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
this.enableEditor = function () {
    userSettings.clientOnly = false;
    if (!userSettings.clientOnly) {
        $("#maintabs-1").show();
        $("#maintabs-2").show();
        $("a[href='#maintabs-1']").parent().show();
        $("a[href='#maintabs-2']").parent().show();
        //bugfix?
        $("#maintabs").tabs("option", "active", 5);
        $("#maintabs").tabs("option", "active", 4);
        $("#maintabs").tabs("option", "active", 3);
        $("#maintabs").tabs("option", "active", 2);
        $("#maintabs").tabs("option", "active", 1);
        $("#maintabs").tabs("option", "active", 0);

        $("#settingsOrg").show();
        $("#profileFieldDesignerDiv").show();
        $("#settingsTestScriptsRow").show();
        $("#settingsApp").show();
    }
}
this.disableEditor = function () {
    userSettings.clientOnly = true;
    if (userSettings.clientOnly) {
        $("#maintabs-1").hide();
        $("#maintabs-2").hide();
        $("a[href='#maintabs-1']").parent().hide();
        $("a[href='#maintabs-2']").parent().hide();
        //bugfix?
        $("#maintabs").tabs("option", "active", 5);
        $("#maintabs").tabs("option", "active", 4);
        $("#maintabs").tabs("option", "active", 3);
        $("#maintabs").tabs("option", "active", 2);
        $("#maintabs").tabs("option", "active", 1);
        $("#maintabs").tabs("option", "active", 0);
        $("#maintabs").tabs("option", "active", 2);

        $("#settingsOrg").hide();
        $("#profileFieldDesignerDiv").hide();
        $("#settingsTestScriptsRow").hide();
        $("#settingsApp").hide();
    }
}
this.publishersDigest = function () {
    if (userSettings.organizationSecret) {
        if (userSettings.organizationSecret.length) {
            const hash = crypto.createHash('sha256');
            hash.update(pwd + userSettings.organizationSecret);
            return hash.digest('hex');
        }
    }
    return "";
}


// this function parses workflow and return array of steps which may be strings and/or Array of strings
// user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com); userA@example.com
// user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com)5; userA@example.com
//
// please read README.md for workflow syntax
this.parseWorkFlow = function (workflow) {
    var ret = new Array();
    var cumulative = "";
    var currentArray = ret;

    for (var i = 0; i < workflow.length; i++) {
        var curr = workflow.substr(i, 1).trim();
        if (curr == ";" || curr == "," || curr == "(" || curr == ")") {
            if (cumulative.length > 0) {
                currentArray.push(cumulative);
                cumulative = "";
            }
            if (curr == "(") {
                var newArray = new Array();
                // new sub array
                ret.push(newArray);
                currentArray = newArray;
            }

            if (curr == ")") {
                // return to main array
                var counter_ = 1;
                var cumulative_ = "";
                if (workflow.length > i) {
                    var j = 0;
                    for (j = i + 1; j < workflow.length; j++) {
                        var curr_ = workflow.substr(j, 1).trim();
                        if (curr_ == "," || curr_ == ";") {
                            break;
                        }
                        else
                            if (/^(0|[1-9]\d*)$/.test(curr_))
                                cumulative_ += curr_
                            else
                                break;
                    }
                    i = j;
                    if (cumulative_.length > 0) {
                        counter_ = parseInt(cumulative_);
                    }
                }
                currentArray.counter = counter_;
                currentArray = ret;
            }
        }
        else
            cumulative += curr.toLowerCase().trim();
    }
    // if there's something left, take it
    if (cumulative.length) {
        currentArray.push(cumulative);
    }

    return ret;
}
this.parseBroadCastRecievers = function (recievers, initiator) {
    var ret = recievers.replace(/,/gi, ';').split(/;/gi).filter(String);

    for (var i = 0; i < ret.length; i++)
        ret[i] = "[BROADCAST]" + (ret[i].toLowerCase() == "initiator" ? initiator.trim() : ret[i].trim());

    return ret;
}

this.deleteDatabase = function () {
    var forms_ = helper.getFilesInDir(helper.getDataBasePath());

    for (var i in forms_) {
        var path = helper.join(helper.getDataBasePath(), forms_[i]);
        helper.deleteFile(path);
    }
    dataCollection.refreshDB();
}
this.deleteSentFolder = function () {
    var forms_ = helper.getFilesInDir(helper.getSentPath());

    for (var i in forms_) {
        var path = helper.join(helper.getSentPath(), forms_[i]);
        helper.deleteFile(path);
    }
    dataCollection.refreshSentDB();
}
this.deleteBroadcastFolder = function () {
    var forms_ = helper.getFilesInDir(helper.getRecievedBroadCastsPath());

    for (var i in forms_) {
        var path = helper.join(helper.getRecievedBroadCastsPath(), forms_[i]);
        helper.deleteFile(path);
    }
    dataCollection.refreshBroadcastDB();
}
