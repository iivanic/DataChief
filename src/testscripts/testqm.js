this.scriptName = "Quality Management Test Script: ";
this.doneCallback = null;
this.next = null;
this.prepareDoneCallback = null;
this.publishDoneCallback = null;
//creates form and saves it to publish
this.prepare = function (callback) {
    helper.log(this.scriptName + "Prepare.");
    this.prepareDoneCallback = callback;
    helper.log(this.scriptName + "Switch to main user.");
    this.switchToUser(userSettings.email);
    this.testStep1(this);
}
//publish
this.publish = function (callback) {
    helper.log(this.scriptName + "Publish.");
    this.publishDoneCallback = callback;
    this.testStep1Part3_(this);
}
this.runTest = function () {
    helper.log(this.scriptName + "Test QM Start.");
    // swith to main user - he will publish everything
    this.switchToUser(userSettings.email);
    this.testStep1Part3(this);

}

//1. create and publish form(s)
this.testStep1 = function (self) {
    helper.log(self.scriptName + "Test step 1 - create and publish form(s).");
    //new form dialog
    $("#add_form").click();

    $("#exampleforms").val("Corrective action - Quality Management");

    //set form name
    $("#tab_title").val("Non conformity");
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
   // $("#tabs-2Form_selectSave_publish").click();
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
this.testStep1Part3_ = function (self) {
    //send and recieve
    imap.callback = self.testStep1ImapPublishDone;
    imap.test = self;
    $("#buttonSendPackages").click();
}

this.testStep1ImapPublishDone = function (error, self) {
    helper.log(self.scriptName + "testStep1ImapPublishDone - packages are on the server.");
    //activate filler
    $(maintabs).tabs("option", "active", 2);
    $(maintabs).tabs("refresh");
    window.setTimeout(self.publishDoneCallback, 1000, self);
}
this.testStep1Part3 = function (self) {
    helper.log(self.scriptName + "testStep1Part3 - go through fill workflow for every user.");

    //send and Recieve - user neeed to recieve published packages
    self.switchToUser("william@barriqueworks.com");
    self.sendRecieve(self, function (self) {
        self.switchToUser("mary@barriqueworks.com");
        self.sendRecieve(self, function (self) {
            self.switchToUser("richard@barriqueworks.com");
            self.sendRecieve(self, function (self) {
                self.switchToUser("john@barriqueworks.com");
                self.sendRecieve(self, function (self) {
                    self.switchToUser("daniel@barriqueworks.com");
                    self.sendRecieve(self, function (self) {
                        self.switchToUser("james@barriqueworks.com");
                        self.sendRecieve(self, function (self) {
                            self.switchToUser("patricia@barriqueworks.com");
                            self.sendRecieve(self, function (self) {
                                self.switchToUser("jennifer@barriqueworks.com");
                                self.sendRecieve(self, function (self) {
                                    self.switchToUser("michael@barriqueworks.com");
                                    self.sendRecieve(self, function (self) {
                                        self.switchToUser("elizabeth@barriqueworks.com");
                                        self.sendRecieve(self, function (self) {
                                            self.switchToUser("margaret@barriqueworks.com");
                                            self.sendRecieve(self, function (self) {
                                                self.openForm();
                                                self.fill1(self, "I have noticed increased customer complaints on barrique leaking. We need to check last and current bacth.");
                                                self.submitForm(self, function (self) {
                                                    self.sendRecieve(self, function (self) {
                                                        self.switchToUser("robert@barriqueworks.com");
                                                        self.sendRecieve(self, function (self) {
                                                            self.switchToUser("linda@barriqueworks.com");
                                                            self.sendRecieve(self, function (self) {
                                                                self.switchToUser("david@barriqueworks.com");
                                                                self.sendRecieve(self, function (self) {
                                                                    self.openForm();
                                                                    self.fill1(self, "Current batch contains lower qulity oak. Does it conform with our Oak quality Policy?");
                                                                    self.submitForm(self, function (self) {
                                                                        self.sendRecieve(self, function (self) {
                                                                            self.switchToUser("daniel@barriqueworks.com");
                                                                            self.sendRecieve(self, function (self) {
                                                                                //Quality manager has recived two ptential non confomities.
                                                                                self.openFormWF1();
                                                                                self.fillWF1(self,
                                                                                    "There is problem with part of oak recieved, not all deliveries were sampled for quality, and our supplier have at least once delivered 2nd class oak instead of 1st class. There was problem with work orders with our Oak supplier but we failed to notice it on delivery.",
                                                                                    "Corrective action",
                                                                                    "Quality policy section 4.5 and 7",
                                                                                    "Return unused lower qulity oak to supplier, give supplier lower score, replace lower quality barrels with our buyers. check future deliveries with more sampling, make Quality policy more clear on how to do sampling and dalivery acceptance.",
                                                                                    "Lower quality oak supplies returned to supplier. Accounting notified. ",
                                                                                    "Supplier given negative score."
                                                                                    , self.end
                                                                                );
                                                                            });
                                                                        });
                                                                    }
                                                                    )
                                                                }
                                                                );
                                                            }
                                                            );
                                                        });
                                                    }
                                                    )
                                                }
                                                );
                                            }
                                            );
                                        }
                                        );
                                    }
                                    );
                                }
                                );
                            }
                            );
                        }
                        );
                    }
                    );
                }
                );
            }
            );
        }
        );
    }
    );
}
this.end = function (self) {

    helper.log(self.scriptName + "Test QM End.");
    helper.log(self.scriptName + "There is two opened forms at Quality Manager daniel@barriqueworks.com")
    if (self.doneCallback) {
        //bind correct 'this'
        var c = self.doneCallback.bind(self.next);
        c();
    }
}
// ----------------------------util 
this.switchToUser = function (user) {

    $("#selectActiveProfile").val(user).selectmenu("refresh");
    userSettings.activeProfile_change();
    helper.log("User switched to " + userSettings.identitySetting.email);
}
this.sr_callback = null
this.sendRecieve = function (self, callback) {
    imap.callback = self.sendRecieveDone;
    imap.test = self;
    self.sr_callback = callback
    $($("span:contains('Send / Recieve')")).click()
}
this.sendRecieveDone = function (error, self) {
    helper.log(self.scriptName + "sendRecieveDone - imap callback.");
    imap.callback = null;
    imap.test = null;

    if (error) {
        helper.log(self.scriptName + "sendRecieveDone - Error.");
        return;
    }
    if (self.sr_callback)
        self.sr_callback(self);
}
this.openForm = function () {
    //open" Non confomity" form in "Published to me"
    $("span[onclick^='filler.addtab(']span:contains('Non conformity')").click();

}
this.openFormWF1 = function () {
    $($("span[onclick^='filler.checktab(']span:contains('Non conformity')")[0]).click();
}
this.fill1 = function (self, description) {
    $($("textarea[id^='dcform")[0]).text(description);
    //sign it
    $($("button[id^='dcform")[0]).click();
    $($("button[id^='dcform")[1]).click();
}
this.fillWF1 = function (self, rootcouse, action, req, actionneeded, actiontaken1, supplier, callback) {
    $($("textarea[id^='dcform")[1]).text(rootcouse);
    //sign it
    $($("button[id^='dcform")[2]).click();
    $($("button[id^='dcform")[3]).click();

    //start

    var result = new Date();
    result.setDate(result.getDate() + 21);

    var dd = result.getDate();
    var mm = result.getMonth() + 1;
    var y = result.getFullYear();

    $($("input[id^='dcform")[3]).val(y.toString() + "-" + helper.padNumber(mm.toString(), 2) + "-" + helper.padNumber(dd.toString()));
    //--
    $($("input[id^='dcform")[2]).val(req);
    $($("select[id^='dcform")[0]).val(action);
    $($("textarea[id^='dcform")[1]).text(rootcouse);
    $($("textarea[id^='dcform")[2]).text(actionneeded);

    $(".addbuttonMarker").click();
    $($("textarea[id^='dcform")[3]).text(actiontaken1);
    $($("button[id^='dcform")[4]).click();
    $($("button[id^='dcform")[5]).click();
    $(".addbuttonMarker").click();

    $($("textarea[id^='dcform")[4]).text(supplier);
    $($("button[id^='dcform")[6]).click();
    $($("button[id^='dcform")[7]).click();
    $($("li:contains('Save to Work')")).click();
    window.setTimeout(callback, 1000, self)
}

this.submitForm = function (self, callback) {
    $($("li:contains('Submit')")).click();
    window.setTimeout(callback, 1000, self);
}