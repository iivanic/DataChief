// this is javascript test file for automated testing
this.scriptName = "Car Log Test Script: ";
this.doneCallback = null;

this.runTest = function () {
    this.testStep1();
}
//1. check for case study users
this.testStep1 = function () {
    //open log panel at bottom
    $("#expandlog").click();
    // set user to first on the list, this is the user not in barrique Case study
    $("#selectActiveProfile").prop("selectedIndex", 0).selectmenu("refresh");


    userSettings.activeProfile_change();
    helper.log(this.scriptName + "User switched to " + userSettings.identitySetting.email);
    helper.log(this.scriptName + "Welcome to TEST. Please DO NOT TOUCH ANYTHING while test is running.");
    helper.log(this.scriptName + "Test step 1 - check for case study users.");
    if (!barrique.isInstalled())
        helper.log(this.scriptName + "BarriqueWorks case study users not installed. Install them and run test again.");
    else {
        helper.log(this.scriptName + "OK - BarriqueWorks case study users found.");
        window.setTimeout(this.testStep2, 100, this);
    }

}

//2. check for design mode
this.testStep2 = function (self) {
    helper.log(self.scriptName + "Test step 2 - check for design mode.");
    if (userSettings.clientOnly) {
        helper.log(self.scriptName + "No design mode detected. Please install DataChief in Design mode.");
    }
    else {
        //activate editor
        $(maintabs).tabs("option", "active", 0);
        $(maintabs).tabs("refresh");
        helper.log(self.scriptName + "OK - Design mode detected.");
        window.setTimeout(self.testStep3, 100, self);
    }
}

//3. clear local cache for every user
this.testStep3 = function (self) {
    helper.log(self.scriptName + "Test step 3 - clear local cache for every user.");

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
    window.setTimeout(self.testStep4, 100, self);
}

//4. create and publish form(s)
this.testStep4 = function (self) {
    helper.log(self.scriptName + "Test step 4 - create and publish form(s).");
    //new form dialog
    $("#add_form").click();
    //set form name
    $("#tab_title").val("Car Log");
    //leave default form selected in dropdown
    window.setTimeout(self.testStep4Part2, 300, self);

}
this.testStep4Part2 = function (self) {
    //Create form and close dialog
    $("#btnCreateFromTemplate").click();
    window.setTimeout(self.testStep4Part3, 300, self);
}
this.testStep4Part3 = function (self) {

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
    imap.callback = self.testStep4ImapPublishDone;
    imap.test = self;
    $("#buttonSendPackages").click();
}

this.testStep4ImapPublishDone = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (!error) {
        helper.log(self.scriptName + "testStep4ImapPublishDone - packeges are on the server.");
        window.setTimeout(self.testStep5, 1000, self);
    }
}

//5. go through worfflow for every user
this.testStep5 = function (self) {
    helper.log(self.scriptName + "Test step 5 - go through fill worfflow for every user.");

    //activate filler
    $(maintabs).tabs("option", "active", 2);
    $(maintabs).tabs("refresh");

    //form is published to:
    //jennifer@barriqueworks.com, michael@barriqueworks.com, elizabeth@barriqueworks.com
    //workflow is: patricia@barriqueworks.com
    //broadcast recivers and final step is: richard@barriqueworks.com


    // switch to Jennifer
    helper.log(self.scriptName + "testStep5 jennifer@barriqueworks.com fillig out form.");
    switchToUser("jennifer@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep5_;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()

}
this.testStep5_ = function (error, self) {
    helper.log(self.scriptName + "testStep5_ - imap callback.");
    imap.callback = null;
    imap.test = null;

    if (error) {
        helper.log(self.scriptName + "testStep5_ - Error.");
        return;
    }
    //open forst form in "Published to me"
    $("span[onclick^='filler.addtab(']").click();
    // fill it out
    //select car
    $($("select[id^='dcformFiller")[0]).val("BMW 328i (Plate N#XX-XXXX)");
    //reason?
    $($("textarea[id^='dcformFiller")[0]).text("Business trip");
    //start
    $($("input[id^='dcformFiller")[0]).val("2017-10-25T10:32");
    //start mileage
    $($("input[id^='dcformFiller")[1]).val("10000");
    //end
    $($("input[id^='dcformFiller")[2]).val("2017-10-27T09:00");
    //end mileage
    $($("input[id^='dcformFiller")[3]).val("10302");
    //ok
    $($("select[id^='dcformFiller")[2]).val("Yes");
    //timestamp it
    $($("button[id^='dcform")[0]).click();
    //sign it
    $($("button[id^='dcform")[1]).click();
    //submit
    $($("li:contains('Submit')")).click();

    //somehow saveForm is async
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause1, 1000, self)
}
this.testStep5Pause1 = function (self) {
    helper.log(self.scriptName + "Continue...");

    //send and Recieve
    // first set callback
    imap.callback = self.testStep5_1;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep5_1 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_1 - Error.");
        return;
    }
    // switch to Jennifer
    helper.log(self.scriptName + "testStep5 michael@barriqueworks.com fillig out form.");
    switchToUser("michael@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep5_1_;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()



}
this.testStep5_1_ = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_1_ - Error.");
        return;
    }
    //open forst form in "Published to me"
    $("span[onclick^='filler.addtab(']").click();
    // fill it out
    //select car
    $($("select[id^='dcformFiller")[0]).val("Ford F-150 (Plate N#XX-XXXX)");
    //reason?
    $($("textarea[id^='dcformFiller")[0]).text("Support request");
    //start
    $($("input[id^='dcformFiller")[0]).val("2017-10-22T12:44");
    //start mileage
    $($("input[id^='dcformFiller")[1]).val("5321");
    //end
    $($("input[id^='dcformFiller")[2]).val("2017-10-22T22:43");
    //end mileage
    $($("input[id^='dcformFiller")[3]).val("5432");
    //ok
    $($("select[id^='dcformFiller")[2]).val("Yes");
    //timestamp it
    $($("button[id^='dcform")[0]).click();
    //sign it
    $($("button[id^='dcform")[1]).click();
    //submit
    $($("li:contains('Submit')")).click();
    //somehow saveForm is async
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause2, 1000, self)

}
this.testStep5Pause2 = function (self) {
    helper.log(self.scriptName + "Continue...");
    //send and Recieve
    // first set callback
    imap.callback = self.testStep5_2;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep5_2 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_2 - Error.");
        return;
    }
    // switch to Jennifer
    helper.log(self.scriptName + "testStep5 elizabeth@barriqueworks.com fillig out form.");
    switchToUser("elizabeth@barriqueworks.com");

    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep5_2_;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()



}
this.testStep5_2_ = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_2_ - Error.");
        return;
    }
    //open forst form in "Published to me"
    $("span[onclick^='filler.addtab(']").click();
    // fill it out
    //select car
    $($("select[id^='dcformFiller")[0]).val("Nissan Leaf (Plate N#XX-XXXX)");
    //reason?
    $($("textarea[id^='dcformFiller")[0]).text("Incident");
    //start
    $($("input[id^='dcformFiller")[0]).val("2017-10-21T10:35");
    //start mileage
    $($("input[id^='dcformFiller")[1]).val("45603");
    //end
    $($("input[id^='dcformFiller")[2]).val("2017-10-21T12:09");
    //end mileage
    $($("input[id^='dcformFiller")[3]).val("45612");
    //ok
    $($("select[id^='dcformFiller")[2]).val("Yes");
    //timestamp it
    $($("button[id^='dcform")[0]).click();
    //sign it
    $($("button[id^='dcform")[1]).click();
    //submit
    $($("li:contains('Submit')")).click();

    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause3, 1000, self)
}
this.testStep5Pause3 = function (self) {
    helper.log(self.scriptName + "Continue...");
    //send and Recieve
    // first set callback
    imap.callback = self.testStep5_3_WorkflowStep; //testStep5_3;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep5_3_WorkflowStep = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_3_WorkflowStep - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep5 Now supervisor - patricia@barriqueworks.com.");
    switchToUser("patricia@barriqueworks.com");

    imap.callback = self.testStep5_3_WorkflowStep_;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}

this.testStep5_3_WorkflowStep_ = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_2_ - Error.");
        return;
    }
    // OK supervisor has now recieved 3 forms to approve
    // we will reject 1, approve 2
    //open forst form in "Published to me"

    $($("span[onclick^='filler.checktab(']")[0]).click();
    // fill it out

    //timestamp it
    $($("button[id^='dcform")[2]).click();
    //sign it
    $($("button[id^='dcform")[3]).click();
    //reject
    $($("select[id^='dcform")[3]).val("No");
    //submit
    $($("li:contains('Submit')")).click();
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause4, 1000, self)
}
this.testStep5Pause4 = function (self) {
    helper.log(self.scriptName + "Continue...");
    $($("span[onclick^='filler.checktab(']")[0]).click();
    // fill it out

    //timestamp it
    $($("button[id^='dcform")[2]).click();
    //sign it
    $($("button[id^='dcform")[3]).click();
    //reject
    $($("select[id^='dcform")[3]).val("Yes");
    //submit
    $($("li:contains('Submit')")).click();
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause5, 1000, self)
}
this.testStep5Pause5 = function (self) {
    helper.log(self.scriptName + "Continue...");
    $($("span[onclick^='filler.checktab(']")[0]).click();
    // fill it out

    //timestamp it
    $($("button[id^='dcform")[2]).click();
    //sign it
    $($("button[id^='dcform")[3]).click();
    //reject
    $($("select[id^='dcform")[3]).val("Yes");
    //submit
    $($("li:contains('Submit')")).click();
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(self.testStep5Pause6, 1000, self)
}
this.testStep5Pause6 = function (self) {
    helper.log(self.scriptName + "Continue...");
    imap.callback = self.testStep5_FinalStep;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep5_FinalStep = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep5_FinalStep - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep5_FinalStep richard@barriqueworks.com recieves packages.");
    switchToUser("richard@barriqueworks.com");


    // first set callback
    imap.callback = self.testStep6;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}

//6. done
this.testStep6 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    $("#selectActiveProfile").prop("selectedIndex", 0).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log(self.scriptName + "Test step 6 - finish.");
    if (self.doneCallback)
        self.doneCallback();
}

//utils
function switchToUser(user) {

    $("#selectActiveProfile").val(user).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log("User switched to " + userSettings.identitySetting.email);
}