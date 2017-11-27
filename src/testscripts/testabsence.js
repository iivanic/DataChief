this.scriptName = "Absence Test Script: ";
this.doneCallback = null;
this.next = null;
this.prepareDoneCallback = null;
this.publishDoneCallback = null;
//creates form and saves it to publish
this.prepare = function (callback)
{
    this.prepareDoneCallback = callback;

    helper.log(this.scriptName + "Prepare.");
    // swith to main user - he will publish everything
    switchToUser(userSettings.email);
    this.testStep1(this);
}
//publish
this.publish = function (callback)
{
    this.publishDoneCallback = callback;
    helper.log(this.scriptName + "Publish.");
    this.testStep1Part2_(this);
}
this.runTest = function () {
    helper.log(this.scriptName + "Test Abence Run.");
    this.testStep1Part3(this);

}

//Prepare --------------------------------------------------------------------
this.testStep1 = function (self) {
    helper.log(self.scriptName + "Test step 1 - create and publish form(s).");
    //new form dialog
    $("#add_form").click();

    $("#exampleforms").val("Employee Absence Request");

    //set form name
    $("#tab_title").val("Absence Request Form for Production department");
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
    //$("#tabs-2Form_selectSave_publish").click();
    $("li:contains('Publish').ui-menu-item").click();
    //activate publisher
    $(maintabs).tabs("option", "active", 1);
    $(maintabs).tabs("refresh");
    //click "Create Packages"
    $("#buttonPublish").click();
    //click OK in configrm dialog
    $("#dialog-confirm-ok").click();
    if (self.prepareDoneCallback) {
        self.prepareDoneCallback();
    }
}
//Publish --------------------------------------------------------------------
this.testStep1Part2_ = function(self)
{
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
                //activate filler
                $(maintabs).tabs("option", "active", 2);
                $(maintabs).tabs("refresh");
        window.setTimeout(self.publishDoneCallback, 1000, self);
    }

}
//Test   --------------------------------------------------------------------
this.testStep1Part3_ = function(self)
{

        self.testStep1Part3(self);
}
//5. go through worfflow for every user
this.testStep1Part3 = function (self) {
    helper.log(self.scriptName + "testStep1Part3 - go through fill workflow for every user.");

    switchToUser("william@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep1Part4;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()

}
this.testStep1Part4 = function (error, self) {
    helper.log(self.scriptName + "testStep1Part4 - imap callback.");
    imap.callback = null;
    imap.test = null;

    if (error) {
        helper.log(self.scriptName + "testStep1Part4 - Error.");
        return;
    }
    self.fillForm(self, self.testStep1Part5);
}
this.testStep1Part5 = function (self) {
    helper.log(self.scriptName + "Continue...");

    //send and Recieve
    // first set callback
    imap.callback = self.testStep1Part6;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part6 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part6 - Error.");
        return;
    }

    switchToUser("linda@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep1Part7;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()

}
this.testStep1Part7 = function (error, self) {
    helper.log(self.scriptName + "testStep1Part7 - imap callback.");
    imap.callback = null;
    imap.test = null;

    if (error) {
        helper.log(self.scriptName + "testStep1Part7 - Error.");
        return;
    }
    self.fillForm(self, self.testStep1Part8);
}
this.testStep1Part8 = function (self) {
    helper.log(self.scriptName + "Continue...");

    //send and Recieve
    // first set callback
    imap.callback = self.testStep1Part9;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part9 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part9 - Error.");
        return;
    }

    switchToUser("david@barriqueworks.com");
    //send and Recieve - user neeed to recieve published packages
    // first set callback
    imap.callback = self.testStep1Part10;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()

}
this.testStep1Part10 = function (error, self) {
    helper.log(self.scriptName + "testStep1Part10 - imap callback.");
    imap.callback = null;
    imap.test = null;

    if (error) {
        helper.log(self.scriptName + "testStep1Part10 - Error.");
        return;
    }
    self.fillForm(self, self.testStep1Part11);
}
this.testStep1Part11 = function (self) {
    //david fills out two forms
    helper.log(self.scriptName + "Continue...");
    self.fillForm(self, self.testStep1Part11_);

}
this.testStep1Part11_ = function (self) {
    helper.log(self.scriptName + "Continue...");
    //send and Recieve
    // first set callback
    imap.callback = self.testStep1Part12;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part12 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part12 - Error.");
        return;
    }
    // First WF step.
    switchToUser("john@barriqueworks.com");

    imap.callback = self.testStep1Part13;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}

this.testStep1Part13 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part13 - Error.");
        return;
    }
    // approve 4 forms

    self.approveWF1(self, self.testStep1Part14)
}
this.testStep1Part14 = function (self) {
    self.approveWF1(self, self.testStep1Part15)
}
this.testStep1Part15 = function (self) {
    self.approveWF1(self, self.testStep1Part16)
}
this.testStep1Part16 = function (self) {
    self.approveWF1(self, self.testStep1Part17)

}
this.testStep1Part17 = function (self) {
    helper.log(self.scriptName + "Continue...");
    imap.callback = self.testStep1Part18;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part18 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part18 - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep1Part18 robert@barriqueworks.com recieves packages.");
    //second WF step
    switchToUser("robert@barriqueworks.com");

    // first set callback
    imap.callback = self.testStep1Part19;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part19 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part19 - Error.");
        return;
    }
    self.approveWF2(self, self.testStep1Part20)
}
this.testStep1Part20 = function (self) {
    self.approveWF2(self, self.testStep1Part21)
}
this.testStep1Part21 = function (self) {
    self.approveWF2(self, self.testStep1Part22, true)
}
this.testStep1Part22 = function (self) {
    self.approveWF2(self, self.testStep1Part23)
}
this.testStep1Part23 = function (self) {
    helper.log(self.scriptName + "Continue...");
    imap.callback = self.testStep1Part24;
    imap.test = self;
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part24 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part24 - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep1Part24 john@barriqueworks.com recieves packages.");
    switchToUser("john@barriqueworks.com");

    // first set callback
    imap.callback = self.testStep1Part25;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part25 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part24 - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep1Part24 william@barriqueworks.com recieves packages.");
    switchToUser("william@barriqueworks.com");

    // first set callback
    imap.callback = self.testStep1Part26;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part26 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part24 - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep1Part24 linda@barriqueworks.com recieves packages.");
    switchToUser("linda@barriqueworks.com");

    // first set callback
    imap.callback = self.testStep1Part27;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part27 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part24 - Error.");
        return;
    }
    helper.log(self.scriptName + "testStep1Part24 david@barriqueworks.com recieves packages.");
    switchToUser("david@barriqueworks.com");

    // first set callback
    imap.callback = self.testStep1Part28;
    imap.test = self
    $($("span:contains('Send / Recieve')")).click()
}
this.testStep1Part28 = function (error, self) {
    imap.callback = null;
    imap.test = null;
    if (error) {
        helper.log(self.scriptName + "testStep1Part28 - Error.");
        return;
    }
    self.end(self);
}


this.end = function (self) {
    helper.log(self.scriptName + "Test Abence End.");
    if (self.doneCallback) {
        //bind correct 'this'
        var c = self.doneCallback.bind(self.next);
        c();
    }
}

//utils
function switchToUser(user) {

    $("#selectActiveProfile").val(user).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log("User switched to " + userSettings.identitySetting.email);
}
var fillFormCallCount = 0;
//fills one of 4 different forms evry time its called 
this.fillForm = function (self, callback) {
    var type = ["Jury Duty", "Bereavement", "Time Off Without Pay", "Medical"];
    var reason = ["Was called for Jury Duty by court.", "My cousin died on tuesday.", "Personal", "Medical examination"];
    var dayoffset = [14, 10, 7, 21];
    var duration = [3, 1, 5, 3];
    //open first form in "Published to me"
    $("span[onclick^='filler.addtab(']span:contains('Absence Request Form for Production department')").click();
    // fill it out
    //select car
    $($("select[id^='dcform")[0]).val(type[fillFormCallCount]);
    //reason?
    $($("textarea[id^='dcform")[0]).text(reason[fillFormCallCount]);
    //start

    var result = new Date();
    result.setDate(result.getDate() + dayoffset[fillFormCallCount]);

    var dd = result.getDate();
    var mm = result.getMonth() + 1;
    var y = result.getFullYear();

    $($("input[id^='dcform")[0]).val(y.toString() + "-" + helper.padNumber(mm.toString(), 2) + "-" + helper.padNumber(dd.toString()));
    //end
    result.setDate(result.getDate() + duration[fillFormCallCount]);

    dd = result.getDate();
    mm = result.getMonth() + 1;
    y = result.getFullYear();

    $($("input[id^='dcform")[1]).val(y.toString() + "-" + helper.padNumber(mm.toString(), 2) + "-" + helper.padNumber(dd.toString()));
    //end mileage

    //timestamp it
    $($("button[id^='dcform")[0]).click();
    //sign it
    $($("button[id^='dcform")[1]).click();
    //submit
    $($("li:contains('Submit')")).click();


    fillFormCallCount++;
    if (fillFormCallCount > 3)
        fillFormCallCount = 0;


    //somehow saveForm is async
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(callback, 1000, self)
}
this.approveWF1 = function (self, callback) {

    $($("span[onclick^='filler.checktab(']")[0]).click();
    // fill it out

    //timestamp it
    $($("button[id^='dcform")[2]).click();
    //sign it
    $($("button[id^='dcform")[3]).click();
    //approve
    $($("select[id^='dcform")[1]).val("Approved");
    $($("textarea[id^='dcform")[1]).val("OK.");
    //submit
    $($("li:contains('Submit')")).click();
    helper.log(self.scriptName + "Pause...");
    window.setTimeout(callback, 1000, self)
}
this.approveWF2 = function (self, callback, reject) {
    
        $($("span[onclick^='filler.checktab(']")[0]).click();
        // fill it out
    
        //timestamp it
        $($("button[id^='dcform")[4]).click();
        //sign it
        $($("button[id^='dcform")[5]).click();
        //approve
        if(!reject)
        {
            $($("select[id^='dcform")[2]).val("Approved");
            $($("textarea[id^='dcform")[2]).val("OK.");
        }           
        else{
            $($("select[id^='dcform")[2]).val("Rejected");
            $($("textarea[id^='dcform")[2]).val("Must reject, too many open Work orders.");
        }
           
        
            
        //submit
        $($("li:contains('Submit')")).click();
        helper.log(self.scriptName + "Pause...");
        window.setTimeout(callback, 1000, self)
    }
    
