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
    if (loadedObj.published) {
        //this package goues to publishers folder
        // create / delete publishers/NAME folder
        pp = helper.join(helper.getPublishersPath(), loadedObj.publisher);
        try {
            helper.deleteFolder(pp);
        }
        catch (e)
        { }
    }
    else {
        //this package goues to recieved folder
        pp = helper.getRecievedPath();
    }

    helper.checkFolder(pp);
    for (var i in loadedObj.forms) {
        var content = JSON.stringify(loadedObj.forms[i], index._formEditor.saveJSONReplacer, 2);
        var fileName = helper.join(pp, loadedObj.forms[i]._name);
        helper.saveTextFile(
            fileName,
            content);
        //    helper.log("----Form saved as " + fileName);

    }
    //we're done, delete package in inbox
    helper.deleteFile(file);

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