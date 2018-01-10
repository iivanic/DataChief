
this.scriptName = " Reset All Script: ";
this.doneCallback = null;
this.next = null;
this.prepareDoneCallback = null;
this.publishDoneCallback = null;

// dumy, just to implement interface like methods
this.prepare = function (callback) {
    helper.log(this.scriptName + "Prepare.");
    helper.log(this.scriptName + "Reset ALL start.");
    helper.log(this.scriptName + "Clearing local cache for every user.");

    

    helper.deleteFile(helper.getUserSettingsFilePath());
    userSettings = require("../userSettings.js"); 

    barrique.uninstall();
    helper.deleteFile(helper.join(helper.getSettingsFolder(), "window-state.json"));
    helper.log(self.scriptName + "Settings (" + helper.getUserSettingsFilePath() + ") deleted.");

    helper.log(this.scriptName + "Reset ALL end.");
    callback();
}
// dumy, just to implement interface like methods
this.publish = function (callback) {
    helper.log(this.scriptName + "Publish.");
    callback();
}

this.runTest = function () {
    if (this.doneCallback) {
        //bind correct 'this'
        var c = this.doneCallback.bind(this.next);
        c();
    }
}