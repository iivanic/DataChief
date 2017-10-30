// this is javascript test file for automated testing

window.setTimeout(testStep1, 500);

//1. check for case study users
function testStep1() {
    //open log panel at bottom
    $("#expandlog").click();
    // set user to first on the list, this is the user not in barrique Case study
    $("#selectActiveProfile").prop("selectedIndex", 0).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log(":::User switched to " + userSettings.identitySetting.email);
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
        "database",
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
    if (!error) {
        helper.log(":::testStep4ImapPublishDone - packeges are on the server.");
        window.setTimeout(testStep5, 1000);
    }
}

//5. go through worfflow for every user
function testStep5() {
    helper.log(":::Test step 5 - go through fill worfflow for every user.");

    //form is published to:
    //jennifer@barriqueworks.com, michael@barriqueworks.com, elizabeth@barriqueworks.com
    //workflow is: patricia@barriqueworks.com
    //broadcast recivers and final step is: richard@barriqueworks.com


    // switch to Jennifer
    helper.log(":::testStep5 jennifer@barriqueworks.com fillig out form.");
    switchToUser("jennifer@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = testStep5_;
    $($("span:contains('Send / Recieve')")).click()

}
function testStep5_(error) {
    helper.log(":::testStep5_ - imap callback.");
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_ - Error.");
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
    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause1, 1000)
}
function testStep5Pause1() {
    helper.log(":::Continue...");

    //send and Recieve
    // first set callback
    imap.callback = testStep5_1;
    $($("span:contains('Send / Recieve')")).click()
}
function testStep5_1(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_1 - Error.");
        return;
    }
    // switch to Jennifer
    helper.log(":::testStep5 michael@barriqueworks.com fillig out form.");
    switchToUser("michael@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = testStep5_1_;
    $($("span:contains('Send / Recieve')")).click()



}
function testStep5_1_(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_1_ - Error.");
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
    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause2, 1000)

}
function testStep5Pause2() {
    helper.log(":::Continue...");
    //send and Recieve
    // first set callback
    imap.callback = testStep5_2;
    $($("span:contains('Send / Recieve')")).click()
}
function testStep5_2(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_2 - Error.");
        return;
    }
    // switch to Jennifer
    helper.log(":::testStep5 elizabeth@barriqueworks.com fillig out form.");
    switchToUser("elizabeth@barriqueworks.com");

    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = testStep5_2_;
    $($("span:contains('Send / Recieve')")).click()



}
function testStep5_2_(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_2_ - Error.");
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

    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause3, 1000)
}
function testStep5Pause3() {
    helper.log(":::Continue...");
    //send and Recieve
    // first set callback
    imap.callback = testStep5_3_WorkflowStep; //testStep5_3;
    $($("span:contains('Send / Recieve')")).click()
}
function testStep5_3_WorkflowStep(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_3_WorkflowStep - Error.");
        return;
    }
    helper.log(":::testStep5 Now supervisor - patricia@barriqueworks.com.");
    switchToUser("patricia@barriqueworks.com");

    imap.callback = testStep5_3_WorkflowStep_;
    $($("span:contains('Send / Recieve')")).click()
}

function testStep5_3_WorkflowStep_(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_2_ - Error.");
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
    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause4, 1000)
}
function testStep5Pause4() {
    helper.log(":::Continue...");
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
    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause5, 1000)
}
function testStep5Pause5() {
    helper.log(":::Continue...");
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
    helper.log(":::Pause...");
    window.setTimeout(testStep5Pause6, 1000)
}
function testStep5Pause6() {
    helper.log(":::Continue...");
    imap.callback = testStep5_FinalStep;
    $($("span:contains('Send / Recieve')")).click()
}
function testStep5_FinalStep(error) {
    imap.callback = null;
    if (error) {
        helper.log(":::testStep5_FinalStep - Error.");
        return;
    }
    helper.log(":::testStep5_FinalStep richard@barriqueworks.com recieves packages.");
    switchToUser("richard@barriqueworks.com");

  
    // first set callback
    imap.callback = testStep6;
    $($("span:contains('Send / Recieve')")).click()
}

//6. done
function testStep6() {
    imap.callback = null;
    $("#selectActiveProfile").prop("selectedIndex", 0).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log(":::Test step 6 - finish.");
}

//utils
function switchToUser(user) {

    $("#selectActiveProfile").val(user).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log("User switched to " + userSettings.identitySetting.email);
}
