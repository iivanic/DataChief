
this.scriptName = " Reset DB Script: ";
this.doneCallback = null;
this.next = null;
this.prepareDoneCallback = null;
this.publishDoneCallback = null;

// dumy, just to implement interface like methods
this.prepare = function (callback) {
    helper.log(this.scriptName + "Prepare.");
    helper.log(this.scriptName + "Reset DB start.");
    helper.log(this.scriptName + "Clearing local cache for every user.");
    
        var folders = [
            "inbox",
            "myoutbox",
            "outbox",
            "prepublish",
            "publish",
            "publishers",
            "ready",
            "recieved",
            "sent", 
            "database",
            "recievedbroadcasts",
            "work"
        ];
        var cnt = 0;
        for (var u in userSettings.Identities) {
            cnt++;
            for (var f in folders)
                helper.deleteFolder(helper.join(helper.join(helper.getSettingsFolder(), userSettings.Identities[u]), folders[f]));
        }

        //delete publish
        var files = helper.getFilesInDir(helper.getPublishPath());
        for (var i in files) {
                    fs.unlink(helper.join(helper.getPublishPath(), files[i]));
        }
        //delete prepublish
        var files = helper.getFilesInDir(helper.getPrepublishPath());
        for (var i in files) {
                    fs.unlink(helper.join(helper.getPrepublishPath(), files[i]));
        }
        //refresh
        publish.refreshFolders();

        helper.log(this.scriptName + "" + cnt.toString() + " user folders (" + (cnt * (folders.length + 1)).toString() + ") deleted.");

    helper.log(this.scriptName + "Reset DB end.");
    helper.log(this.scriptName + "End prepare.");
    callback();
}
// dumy, just to implement interface like methods
this.publish = function (callback) {
    helper.log(this.scriptName + "Publish.");
    callback();
}

this.runTest = function()
{
    if(this.doneCallback)
    {
        //bind correct 'this'
        var c =this.doneCallback.bind(this.next);
        c();
    }
}