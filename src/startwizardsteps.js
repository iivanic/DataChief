var wform = null;
var step2Caption;
var step2Content;
var step5Content;
var step5Content;
var step6Caption;
var step6Content;

this.initWizard = function () {
    $("#startwizard").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        stepsOrientation: "vertical",
        onStepChanging: function (event, currentIndex, newIndex) {
            return startwizardsteps.onStepChanging(event, currentIndex, newIndex);
        },
        onFinishing: function (event, currentIndex) {
            return startwizardsteps.onFinishing(event, currentIndex);
        },
        onFinished: function (event, currentIndex) {
            startwizardsteps.onFinished(event, currentIndex);
        }
    });
}

function validator() {
    if (wform)
        wform.destroy();
    wform = $.validator("#wizardForm");
    wform.validate({
        errorPlacement: function errorPlacement(error, element) { element.before(error); },
        rules: {
            startDialogCompanPassword1: {
                equalTo: "#startDialogCompanPassword"
            },
            startDialogUserSecretl2: {
                equalTo: "#startDialogUserSecretl1"
            },
            step4textSettingsIMAPPassword1: {
                equalTo: "#step4textSettingsIMAPPassword"
            },

        }
    });
}
this.smtpAuthClick = function () {

    if ($("#step5SettingsSMTPRequiresAuthentication").is(":checked")) {
        userSettings.RequiresAuthentication = true;
        $("#step5textSettingsSMTPUsername").prop("disabled", false);
        $("#step5textSettingsSMTPPassword").prop("disabled", false);
        $("#step5textSettingsSMTPPassword1").prop("disabled", false);
    }
    else {
        userSettings.RequiresAuthentication = false;
        $("#step5textSettingsSMTPUsername").prop("disabled", true);
        $("#step5textSettingsSMTPPassword").prop("disabled", true);
        $("#step5textSettingsSMTPPassword1").prop("disabled", true);
    }

}
$(document).ready(
    function () {

        $("#IMAPTest").button();
        $("#SMTPTest").button();


        startwizardsteps.initWizard();
        validator();
        //step 1
        $("#Startdesigner1").prop("checked", userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner1").on("click", function () {
            $("#startwizard li[role='tab'][aria-selected!='true']").prop("class", "disabled");
            var _steps = $("#startwizard").steps("getStepsLength");
            if (!$("#Startdesigner2").is(":checked") && !userSettings.clientOnly) {

                // remove order span tag infront of caption
                step2Caption = $("#startwizard-t-1").clone()	//clone the element
                    .children()	//select all the children
                    .remove()	//remove all the children
                    .end()	//again go back to selected element
                    .text().trim();	//get the text of element
                step6Caption = $("li a:contains('. Case Study')").clone()	//clone the element
                    .children()	//select all the children
                    .remove()	//remove all the children
                    .end()	//again go back to selected element
                    .text().trim();	//get the text of element

                step2Content = $("#startwizard-p-1").html();
                step6Content = $("section:contains('Case Study users')").html();

                var _ar = $("section:contains('Case Study users')").prop("id").split('-');
                $('#startwizard').steps('remove', parseInt(_ar[_ar.length - 1]));

                $('#startwizard').steps('remove', 1);
                /*      $("#startwizard").steps("destroy");
                      startwizardsteps.initWizard();*/
                userSettings.clientOnly = true;
                validator();
            }
        });

        $("#Startdesigner2").prop("checked", !userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner2").on("click", function () {
            //reset tabs
            $("#startwizard li[role='tab'][aria-selected!='true']").prop("class", "disabled");

            var _steps = $("#startwizard").steps("getStepsLength");
            if ($("#Startdesigner2").is(":checked") && userSettings.clientOnly) {
                $('#startwizard').steps('insert', 1, { title: step2Caption, content: step2Content });
                //step 2

                $("#startDialogCompanyName").val(userSettings.organization);
                $("#startDialogCompanPassword").val(userSettings.organizationSecret);
                $("#startDialogCompanPassword1").val(userSettings.organizationSecret);


                var _ar;
                if ($("section:contains('Set Up SMTP Account.')").length > 0) {
                    _ar = $("section:contains('Set Up SMTP Account.')").prop("id").split('-');
                }
                else {
                    _ar = $("section:contains('Set Up IMAP (Email) Account.')").prop("id").split('-');
                }
                var _index = parseInt(_ar[_ar.length - 1]);
                _index = _index + 1;

                $('#startwizard').steps('insert', _index, { title: step6Caption, content: step6Content });
                //restore values, not saved in old html
                $("#step4textSettingsIMAPUsername").val(userSettings.identitySetting.imapUserName);
                $("#step4textSettingsIMAPPassword").val(userSettings.identitySetting.imapPassword);
                $("#step4textSettingsIMAPPassword1").val(userSettings.identitySetting.imapPassword);
                $("#step4textSettingsIMAPServer").val(userSettings.identitySetting.imapServer);
                $("#step4textSettingsIMAPServerPort").val(userSettings.identitySetting.imapPort);
                $("#step4textSettingsIMAPRequiresSSL").prop("checked", userSettings.identitySetting.imapRequiresSSL ? "checked" : "");

                //step 4
                /* $("#startDialogName").val(userSettings.identitySetting.name);
                 $("#startDialogemail").val(userSettings.identitySetting.email);
                 $("#startDialogUserSecretl1").val(userSettings.identitySetting.userSecret);
                 $("#startDialogUserSecretl2").val(userSettings.identitySetting.userSecret);*/
                userSettings.checkCaseStudy();
                /*        $("#startwizard").steps("destroy");
                        startwizardsteps.initWizard();*/
                userSettings.clientOnly = false;
                validator();
            }
        });

        $("#startDialogappMode1").prop("checked", userSettings.useSingleAccount ? "checked" : "");
        $("#startDialogappMode1").on("click", function () {

            if ($("#startDialogappMode1").is(":checked") && !userSettings.useSingleAccount) {

                //     $("#startwizard li[role='tab'][aria-selected!='true']").prop("class", "disabled");
                $("#startwizard li[role='tab'][aria-selected!='true']").not('.first').each(function () {
                    $(this).prop("class", "disabled")

                });
                if ($($("#startwizard li[role='tab'][aria-selected!='true']")[1]).text() == "2. Company" &&
                    $($("#startwizard li[role='tab']")[0]).attr("aria-selected") != "true"
                ) {
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("class", "first done");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("aria-selected", "false");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("disabled", "false");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("class", "done");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("aria-selected", "false");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("disabled", "false");

                }


                userSettings.useSingleAccount = true;
                // remove order span tag infront of caption
                step5Caption = $("li a:contains('SMTP')").clone()	//clone the element
                    .children()	//select all the children
                    .remove()	//remove all the children
                    .end()	//again go back to selected element
                    .text().trim();	//get the text of element
                step5Content = $("section:contains('Set Up SMTP Account.')").html();
                var _ar = $("section:contains('Set Up SMTP Account.')").prop("id").split('-');
                $('#startwizard').steps('remove', parseInt(_ar[_ar.length - 1]));
                validator();
            }
        });
        $("#startDialogappMode2").prop("checked", !userSettings.useSingleAccount ? "checked" : "");
        $("#startDialogappMode2").on("click", function () {

            if ($("#startDialogappMode2").is(":checked") && userSettings.useSingleAccount) {

                $("#startwizard li[role='tab'][aria-selected!='true']").not('.first').each(function () {
                    $(this).prop("class", "disabled")

                });


                if (
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).text() == "2. Company" &&
                    $($("#startwizard li[role='tab']")[0]).attr("aria-selected") != "true"
                ) {
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("class", "first done");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("aria-selected", "false");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[0]).prop("disabled", "false");

                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("class", "done");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("aria-selected", "false");
                    $($("#startwizard li[role='tab'][aria-selected!='true']")[1]).prop("disabled", "false");

                }


                userSettings.useSingleAccount = false;
                var _ar = $("section:contains('Set Up IMAP (Email) Account.')").prop("id").split('-');
                var _index = parseInt(_ar[_ar.length - 1]);
                _index = _index + 1;
                $('#startwizard').steps('insert', _index, { title: step5Caption, content: step5Content });
                $("#step5textSettingsSMTPUsername").val(userSettings.identitySetting.smtpUserName);
                $("#step5textSettingsSMTPPassword").val(userSettings.identitySetting.smtpPassword);
                $("#step5textSettingsSMTPPassword1").val(userSettings.identitySetting.smtpPassword);
                $("#step5textSettingsSMTPServer").val(userSettings.identitySetting.smtpServer);
                $("#step5textSettingsSMTPServerPort").val(userSettings.identitySetting.smtpPort);
                $("#step5textSettingsSMTPRequiresSSL").prop("checked", userSettings.identitySetting.smtpRequiresSSL ? "checked" : "")
                validator();
            }
        });
        $("#step5SettingsSMTPRequiresAuthentication").prop("checked", !userSettings.RequiresAuthentication ? "checked" : "");
        //    $("#step5SettingsSMTPRequiresAuthentication").on("click", 
        //    );


        //step 2
        $("#startDialogCompanyName").val(userSettings.organization);
        $("#startDialogCompanPassword").val(userSettings.organizationSecret);
        $("#startDialogCompanPassword1").val(userSettings.organizationSecret);
        //step 3
        $("#startDialogappMode1").prop("checked", userSettings.useSingleAccount ? "checked" : "");
        $("#startDialogappMode2").prop("checked", !userSettings.useSingleAccount ? "checked" : "");
        //step 4
        $("#step4textSettingsIMAPUsername").val(userSettings.identitySetting.imapUserName);
        $("#step4textSettingsIMAPPassword").val(userSettings.identitySetting.imapPassword);
        $("#step4textSettingsIMAPPassword1").val(userSettings.identitySetting.imapPassword);
        $("#step4textSettingsIMAPServer").val(userSettings.identitySetting.imapServer);
        $("#step4textSettingsIMAPServerPort").val(userSettings.identitySetting.imapPort);
        $("#step4textSettingsIMAPRequiresSSL").prop("checked", userSettings.identitySetting.imapRequiresSSL ? "checked" : "");
        //step 5
        $("#startDialogName").val(userSettings.identitySetting.name);
        $("#startDialogemail").val(userSettings.identitySetting.email);
        $("#startDialogUserSecretl1").val(userSettings.identitySetting.userSecret);
        $("#startDialogUserSecretl2").val(userSettings.identitySetting.userSecret);
        if (!userSettings.useSingleAccount) {
            $("#step5textSettingsSMTPUsername").val(userSettings.identitySetting.smtpUserName);
            $("#step5textSettingsSMTPPassword").val(userSettings.identitySetting.smtpPassword);
            $("#step5textSettingsSMTPPassword1").val(userSettings.identitySetting.smtpPassword);
            $("#step5textSettingsSMTPServer").val(userSettings.identitySetting.smtpServer);
            $("#step5textSettingsSMTPServerPort").val(userSettings.identitySetting.smtpPort);
            $("#step5textSettingsSMTPRequiresSSL").prop("checked", userSettings.identitySetting.smtpRequiresSSL ? "checked" : "");
            $("#step5SettingsSMTPRequiresAuthentication").prop("checked", userSettings.RequiresAuthentication ? "checked" : "");
        }

        // if client only, remove extra steps and remember them...
        if (userSettings.clientOnly) {
            userSettings.clientOnly = false;
            $("#Startdesigner1").click();
        }
        if (userSettings.useSingleAccount) {
            userSettings.useSingleAccount = false;
            $("#startDialogappMode1").click();
        }
        startwizardsteps.smtpAuthClick();
    }
)
this.onStepChanging = function (event, currentIndex, newIndex) {

    //  wform =  $.validator("#wizardForm");
    // form.validate().settings.ignore = ":disabled,:hidden";
    //  return form.valid();

    // allow step back even id current step is not valid
    if (currentIndex > newIndex) {
        return true;
    }
    this.fromGui();
    userSettings.save();
    wform.validate().settings.ignore = ":disabled,:hidden";
    try {
        return wform.valid();
    } catch (ex) {
        helper.log(ex);
        console.log(ex);
        return true;
    }

}
this.onFinishing = function (event, currentIndex) {
    wform.validate().settings.ignore = ":disabled";
    return wform.valid();
}
this.onFinished = function (event, currentIndex) {
    userSettings.wizadFinished = true;
    this.fromGui();
    userSettings.save();
    userSettings.toGui();
    if (!imapTimer)
        imapTimer = window.setTimeout("imap.go(true)", 4000);
    $("#startDialog").dialog("close");

    if (userSettings.clientOnly)
        helper.disableEditor();
    else
        helper.enableEditor();
}
this.fromGui = function () {
    //step 1
    userSettings.clientOnly = $("#Startdesigner1").prop("checked");
    var _steps = $("#startwizard").steps("getStepsLength");
    // do not store Organization info if in clientMode
    if ($("#Startdesigner2").is(":checked")) {
        //step 2
        userSettings.organization = $("#startDialogCompanyName").val();
        userSettings.organizationSecret = $("#startDialogCompanPassword").val();
    }
    //step 3
    userSettings.useSingleAccount = $("#startDialogappMode1").prop("checked");

    //step 4
    userSettings.identitySetting.name = $("#startDialogName").val();
    userSettings.identitySetting.email = $("#startDialogemail").val();
    //  userSettings.identitySetting.oldEmail = $("#startDialogemail").val();
    userSettings.identitySetting.userSecret = $("#startDialogUserSecretl1").val();
    userSettings.identitySetting.userSecret = $("#startDialogUserSecretl2").val();
    //this mail is our main identity
    userSettings.email = userSettings.identitySetting.email;
    userSettings.mainEmail = userSettings.email;
    //step 4
    if ($("#step4textSettingsIMAPUsername").val())
        userSettings.identitySetting.imapUserName = $("#step4textSettingsIMAPUsername").val();
    if ($("#step4textSettingsIMAPPassword").val())
        userSettings.identitySetting.imapPassword = $("#step4textSettingsIMAPPassword").val();
    if ($("#step4textSettingsIMAPPassword1").val())
        userSettings.identitySetting.imapPassword = $("#step4textSettingsIMAPPassword1").val();
    if ($("#step4textSettingsIMAPServer").val())
        userSettings.identitySetting.imapServer = $("#step4textSettingsIMAPServer").val();
    if ($("#step4textSettingsIMAPServerPort").val())
        userSettings.identitySetting.imapPort = $("#step4textSettingsIMAPServerPort").val();
    if ($("#step4textSettingsIMAPRequiresSSL").val())
        userSettings.identitySetting.imapRequiresSSL = $("#step4textSettingsIMAPRequiresSSL").prop("checked");

    if (userSettings.useSingleAccount) {
        if ($("#step5textSettingsSMTPUsername").val())
            userSettings.identitySetting.smtpUserName = $("#step5textSettingsSMTPUsername").val();
        if ($("#step5textSettingsSMTPPassword").val())
            userSettings.identitySetting.smtpPassword = $("#step5textSettingsSMTPPassword").val();
        if ($("#step5textSettingsSMTPPassword1").val())
            userSettings.identitySetting.smtpPassword = $("#step5textSettingsSMTPPassword1").val();
        if ($("#step5textSettingsSMTPServer").val())
            userSettings.identitySetting.smtpServer = $("#step5textSettingsSMTPServer").val();
        if ($("#step5textSettingsSMTPServerPort").val())
            userSettings.identitySetting.smtpPort = $("#step5textSettingsSMTPServerPort").val();
        if ($("#step5textSettingsSMTPRequiresSSL").val())
            userSettings.identitySetting.smtpRequiresSSL = $("#step5textSettingsSMTPRequiresSSL").prop("checked");
        if ($("#step5SettingsSMTPRequiresAuthentication").val())
            userSettings.identitySetting.smtpRequiresSSL = $("#step5SettingsSMTPRequiresAuthentication").prop("checked");
    }


}