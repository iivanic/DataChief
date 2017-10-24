// this is javascript test file for automated testing, executed with "eval"

window.setTimeout(testStep1, 500);

//1. check for case study users
function testStep1() {
    //open log panel at bottom
    $("#expandlog").click();

    helper.log(":::Welcome to TEST. Please DO NOT TOUCH ANYTHING while test is running.");
    helper.log(":::Test step 1 - check for case study users.");
    if (!barrique.isInstalled())
        helper.log(":::BarriqueWorks case study users not installed. Install them and run test again.");
    else {
        helper.log(":::OK - BarriqueWorks case study users found.");
        window.setTimeout(testStep2, 100);
    }

}

//2. check for design mode
function testStep2() {
    helper.log(":::Test step 2 - check for design mode.");
    if (userSettings.clientOnly) {
        helper.log(":::No design mode detected. Please install DataChief in Design mode.");
    }
    else {
        helper.log(":::OK - Design mode detected.");
        window.setTimeout(testStep3, 100);
    }
}

//3. clear local cache for every user
function testStep3() {
    helper.log(":::Test step 3 - clear local cache for every user.");

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
        "work"
    ];
    var cnt = 0;
    for (var u in userSettings.Identities) {
        cnt++;
        for (var f in folders)
            helper.deleteFolder(helper.join(helper.join(helper.getSettingsFolder(), userSettings.Identities[u]), folders[f]));
    }
    helper.log(":::" + cnt.toString() + " user folders (" + (cnt * (folders.length + 1)).toString() + ") deleted.");
    window.setTimeout(testStep4, 100);
}

//4. create and publish form(s)
function testStep4() {
    helper.log(":::Test step 4 - create and publish form(s).");
    //new form dialog
    $("#add_form").click();
    //set form name
    $("#tab_title").val("Car Log");
    //leave default form selected in dropdown
    window.setTimeout(testStep4Part2, 300);

}
function testStep4Part2() {
       //Create form and close dialog
       $("#btnCreateFromTemplate").click();
       window.setTimeout(testStep4Part3, 300);
}
function testStep4Part3() {
 
    //publish
    //click "Save to publish"
    $("#tabs-2Form_selectSave_publish").click()
    //click "Create Packages"
    $("#buttonPublish").click();
    //click OK in configrm dialog
    $("#dialog-confirm-ok").click();
    //send and recieve
    imap.callback = testStep4ImapPublishDone;
    $("#buttonSendPackages").click();
}

function testStep4ImapPublishDone(error) {
    imap.callback = null;
    if (!error)
        testStep5();
}

//5. go through worfflow for every user
function testStep5() {
    helper.log(":::Test step 5 - go through worfflow for every user.");
    testStep6();
}

//6. done
function testStep6() {
    helper.log(":::Test step 6 - finish.");
}