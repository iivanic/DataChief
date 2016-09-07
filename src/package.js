var ipath;
//publishersDigest


// Package can be
// - published          - they have 'published' flag set to true and are from publisher
//                      - they are never mixed with workflow packages 
// - workflow package   - they go to to 'recieved' folder or to 'database' folder if workflow has finished.
//                      - 'workflowpackage' flag is set to true
// - broadcast package  - they go to 'recievedbroadcasts' folder.
//                      - 'broadcastpackage' flag set to true

this.loadPackage = function (file) {
    helper.log("--Importing package " + file);
    file = helper.join(ipath, file);
    var jsonstring = helper.loadFile(file);
    jsonstring = jsonstring.split('START')[1];
    var loadedObj = JSON.parse(helper.decrypt(jsonstring, userSettings.identitySetting.userSecret));
    var pp;
    if (!loadedObj.publisher) {
        loadedObj.publisher = "Unknown publisher";
    }
    var oldFiles;
    if (loadedObj.published) {
        //forms from  this package go to publishers folder
        //package can also contain number of commands
        helper.log("----Package " + file + ' is PUBLISHED package.');

        // create / delete publishers/NAME folder
        pp = helper.join(helper.getPublishersPath(), loadedObj.publisher);
        helper.checkFolder(pp);
        oldFiles = helper.getFilesInDir(pp);
        try {
            helper.deleteFolder(pp);
            helper.checkFolder(pp);
        }
        catch (e)
        { }
    }
    else if (loadedObj.workflowpackage) {
        //forms from this package go to recieved or database folder
        helper.log("----Package " + file + ' is WORKFLOW package.');
        pp = helper.getRecievedPath();

        helper.checkFolder(helper.getDataBasePath());
        helper.checkFolder(pp);
    } else if (loadedObj.broadcastpackage) {
        //this package goues to recievedbroadcasts folder
        helper.log("----Package " + file + ' is BROADCAST package.');

        pp = helper.getRecievedBroadCastsPath();
        helper.checkFolder(pp);
    }

    //Handle commands if exists.
    for (var i in loadedObj.commands) {
        //execute commands..
        var cmd = require("./command.js");
        cmd.ctor(loadedObj.commands[i].command, loadedObj.commands[i].textmessage, loadedObj.commands[i].user)
        cmd.run();
    }

    for (var i in loadedObj.forms) {
        var version = loadedObj.forms[i]._version;
        var id = loadedObj.forms[i]._id;
        if (loadedObj.published)
            loadedObj.forms[i].published = true;
        if (loadedObj.workflowpackage)
            loadedObj.forms[i].workflowpackage = true;
        if (loadedObj.broadcastpackage)
            loadedObj.forms[i].broadcastpackage = true;
        var content = JSON.stringify(loadedObj.forms[i], index._formEditor.saveJSONReplacer, 2);
        var fileName = helper.join(pp, id + "_" + version + "_" + loadedObj.forms[i]._name);
        if (loadedObj.forms[i].published) {
            var status = this.findFileStatus(id, version, oldFiles);
            fileName = helper.join(pp, status + "_" + id + "_" + version + "_" + loadedObj.forms[i]._name);
        }
        if (loadedObj.forms[i].workflowpackage) {
            //is this form completed the workflow?
            /// TODO : id is OK, but we must have form template type.
            if (false)
                fileName = helper.join(helper.getDataBasePath(), id + "_" + version + "_" + loadedObj.forms[i]._name);

        }
        helper.saveTextFile(
            fileName,
            content);
        helper.log("----Form saved as " + fileName);

    }
    //we're done, delete package in inbox
    helper.deleteFile(file);
    helper.log("--Done importing package " + file);
}
this.findFileStatus = function (id, version, arr) {
    var ret = "N";
    for (var i in arr) {
        var oldFileparts = arr[i].split("_");
        if (oldFileparts[1] == id) {

            if (Math.abs(version) != Math.abs(oldFileparts[2])) {
                ret = "U";
            }
            else {
                ret = "X";
            }
        }
    }
    return ret;
}
this.loadPackages = function () {
    ipath = helper.getInboxPath();
    var files = helper.getFilesInDir(ipath);
    if (files.length == 0)
        helper.log("No downloaded packages found.");
    else {
        helper.log("Importing " + files.length + " downloaded package(s).");
        for (var i in files) {
            this.loadPackage(files[i]);
        }
        helper.log("Done importing downloaded packages.");
        filler.refreshFolders();
    }
}