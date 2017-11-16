this.scriptName = "Absence Test Script: ";
this.doneCallback = null;
this.next = null;
this.runTest = function () {
    helper.log(this.scriptName + "Test Abence Start.");
    // swith to main user - he will publish everything
    switchToUser(userSettings.email);
    this.testStep1(this);

}

//4. create and publish form(s)
this.testStep1 = function (self) {
    helper.log(self.scriptName + "Test step 1 - create and publish form(s).");
    //new form dialog
    $("#add_form").click();

    $("#exampleforms").val("Employee Absence Request");
    
    //set form name
    $("#tab_title").val("Employee Absence Request Form for Production department");
    //leave default form selected in dropdown
    window.setTimeout(self.testStep1Part1, 300, self);

}
this.testStep1Part1 = function (self) {
    //Create form and close dialog
    $("#btnCreateFromTemplate").click();
    window.setTimeout(self.testStep1Part2, 300, self);
}
this.testStep1Part2 = function (self) {

    //publish
    //click "Save to publish"
    $("#tabs-2Form_selectSave_publish").click();
    //activate publisher
    $(maintabs).tabs("option", "active", 1);
    $(maintabs).tabs("refresh");
    //click "Create Packages"
    $("#buttonPublish").click();
    //click OK in configrm dialog
    $("#dialog-confirm-ok").click();
    //send and recieve
    imap.callback = self.testStep1ImapPublishDone;
    imap.test = self;
    $("#buttonSendPackages").click();
}

this.testStep1ImapPublishDone = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (!error) {
        helper.log(self.scriptName + "testStep1ImapPublishDone - packeges are on the server.");
        window.setTimeout(self.testStep1Part3, 1000, self);
    }
}
//5. go through worfflow for every user
this.testStep1Part3 = function (self) {
    helper.log(self.scriptName + "testStep1Part3 - go through fill workflow for every user.");

    //activate filler
    $(maintabs).tabs("option", "active", 2);
    $(maintabs).tabs("refresh");

    self.end(self);
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