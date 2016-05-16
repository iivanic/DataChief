var ipath;
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
        //this package goues to publishers folder
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
    else {
        //this package goues to recieved folder
        pp = helper.getRecievedPath();
        helper.checkFolder(pp);
    }

    for (var i in loadedObj.forms) {
        var version = loadedObj.forms[i]._version;
        var id = loadedObj.forms[i]._id;
        loadedObj.forms[i].published=true;
        var content = JSON.stringify(loadedObj.forms[i], index._formEditor.saveJSONReplacer, 2);
        var status = this.findFileStatus(id, version, oldFiles);
        var fileName = helper.join(pp, status + "_" + id + "_" + version + "_" + loadedObj.forms[i]._name);
        helper.saveTextFile(
            fileName,
            content);
        helper.log("----Form saved as " + fileName);

    }
    //we're done, delete package in inbox
    helper.deleteFile(file);

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