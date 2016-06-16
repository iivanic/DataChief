var wform
var step2Caption;
var step4Caption;
var step2Content;
var step4Content;

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

$(document).ready(
    function () {

        $("#IMAPTest").button();

        wform = $("#wizardForm");
        wform.validate({
            errorPlacement: function errorPlacement(error, element) { element.before(error); },
            rules: {
                startDialogCompanPassword1: {
                    equalTo: "#startDialogCompanPassword"
                },
                startDialogUserSecretl2: {
                    equalTo: "#startDialogUserSecretl1"
                },
                step5textSettingsIMAPPassword1: {
                    equalTo: "#step5textSettingsIMAPPassword"
                },

            }
        });

        startwizardsteps.initWizard();
        //step 1
        $("#Startdesigner1").prop("checked", userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner1").on("click", function () {

            var _steps = $("#startwizard").steps("getStepsLength");
            if (_steps > 6) {

                // remove order span tag infront of caption
                step2Caption = $("#startwizard-t-1").clone()	//clone the element
                    .children()	//select all the children
                    .remove()	//remove all the children
                    .end()	//again go back to selected element
                    .text();	//get the text of element
                step4Caption = $("#startwizard-t-4").clone()	//clone the element
                    .children()	//select all the children
                    .remove()	//remove all the children
                    .end()	//again go back to selected element
                    .text();	//get the text of element

                step2Content = $("#startwizard-p-1").html();
                step4Content = $("#startwizard-p-4").html();


                $('#startwizard').steps('remove', 4);
                $('#startwizard').steps('remove', 1);
                /*      $("#startwizard").steps("destroy");
                      startwizardsteps.initWizard();*/
       
            }
        });
        // if client only, remove extra steps and remember them...
        if (userSettings.clientOnly)
            $("#Startdesigner1").click();

        $("#Startdesigner2").prop("checked", !userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner2").on("click", function () {
            var _steps = $("#startwizard").steps("getStepsLength");
            if (_steps < 6) {
                $('#startwizard').steps('insert', 1, { title: step2Caption, content: step2Content });
                //step 2

                $("#startDialogCompanyName").val(userSettings.organization);
                $("#startDialogCompanPassword").val(userSettings.organizationSecret);
                $("#startDialogCompanPassword1").val(userSettings.organizationSecret);

                $('#startwizard').steps('insert', 4, { title: step4Caption, content: step4Content });
                //step 4
                /* $("#startDialogName").val(userSettings.identitySetting.name);
                 $("#startDialogemail").val(userSettings.identitySetting.email);
                 $("#startDialogUserSecretl1").val(userSettings.identitySetting.userSecret);
                 $("#startDialogUserSecretl2").val(userSettings.identitySetting.userSecret);*/
                userSettings.checkCaseStudy();
                /*        $("#startwizard").steps("destroy");
                        startwizardsteps.initWizard();*/
            

            }
        });

        //step 2
        $("#startDialogCompanyName").val(userSettings.organization);
        $("#startDialogCompanPassword").val(userSettings.organizationSecret);
        $("#startDialogCompanPassword1").val(userSettings.organizationSecret);
        //step 3
        $("#startDialogappMode1").prop("checked", userSettings.useSingleAccount ? "checked" : "");
        $("#startDialogappMode2").prop("checked", !userSettings.useSingleAccount ? "checked" : "");
        //step 4
        $("#startDialogName").val(userSettings.identitySetting.name);
        $("#startDialogemail").val(userSettings.identitySetting.email);
        $("#startDialogUserSecretl1").val(userSettings.identitySetting.userSecret);
        $("#startDialogUserSecretl2").val(userSettings.identitySetting.userSecret);
        //step 5
        $("#step5textSettingsIMAPUsername").val(userSettings.identitySetting.imapUserName);
        $("#step5textSettingsIMAPPassword").val(userSettings.identitySetting.imapPassword);
        $("#step5textSettingsIMAPPassword1").val(userSettings.identitySetting.imapPassword);
        $("#step5textSettingsIMAPServer").val(userSettings.identitySetting.imapServer);
        $("#step5textSettingsIMAPServerPort").val(userSettings.identitySetting.imapPort);
        $("#step5textSettingsIMAPRequiresSSL").prop("checked", userSettings.identitySetting.imapRequiresSSL ? "checked" : "");

    }
)
this.onStepChanging = function (event, currentIndex, newIndex) {

    wform = $("#wizardForm");
    // form.validate().settings.ignore = ":disabled,:hidden";
    //  return form.valid();

    // allow step back even id current step is not valid
    if (currentIndex > newIndex) {
        return true;
    }
    this.fromGui();
    userSettings.save();
    wform.validate().settings.ignore = ":disabled,:hidden";
    return wform.valid();

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
    //step 2
    userSettings.organization = $("#startDialogCompanyName").val();
    userSettings.organizationSecret = $("#startDialogCompanPassword").val();

    //step 3
    userSettings.useSingleAccount = $("#startDialogappMode1").prop("checked");

    //step 4
    userSettings.identitySetting.name = $("#startDialogName").val();
    userSettings.identitySetting.email = $("#startDialogemail").val();
    userSettings.identitySetting.userSecret = $("#startDialogUserSecretl1").val();
    userSettings.identitySetting.userSecret = $("#startDialogUserSecretl2").val();
    //step 5
    userSettings.identitySetting.imapUserName = $("#step5textSettingsIMAPUsername").val();
    userSettings.identitySetting.imapPassword = $("#step5textSettingsIMAPPassword").val();
    userSettings.identitySetting.imapPassword = $("#step5textSettingsIMAPPassword1").val();
    userSettings.identitySetting.imapServer = $("#step5textSettingsIMAPServer").val();
    userSettings.identitySetting.imapPort = $("#step5textSettingsIMAPServerPort").val();
    userSettings.identitySetting.imapRequiresSSL = $("#step5textSettingsIMAPRequiresSSL").prop("checked");


}