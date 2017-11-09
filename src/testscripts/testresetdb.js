
this.scriptName = "Reset DB Test Script: ";
this.doneCallback = null;
this.next = null;
this.runTest = function()
{
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
    
        helper.log(self.scriptName + "" + cnt.toString() + " user folders (" + (cnt * (folders.length + 1)).toString() + ") deleted.");

    helper.log(this.scriptName + "Reset DB end.");
    if(this.doneCallback)
    {
        //bind correct 'this'
        var c =this.doneCallback.bind(this.next);
        c();
    }
}