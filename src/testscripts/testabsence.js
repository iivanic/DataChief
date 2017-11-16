this.scriptName = "Absence Test Script: ";
this.doneCallback = null;
this.next = null;
this.runTest = function () {
    helper.log(this.scriptName + "Test Abence Start.");
    // swith to main user - he will publish everything
    switchToUser(userSettings.email);
    this.end(this);

}

this.end = function (self) {
    helper.log(self.scriptName + "Test Abence End.");
    if (this.doneCallback) {
        //bind correct 'this'
        var c = this.doneCallback.bind(this.next);
        c();
    }
}

//utils
function switchToUser(user) {

    $("#selectActiveProfile").val(user).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log("User switched to " + userSettings.identitySetting.email);
}