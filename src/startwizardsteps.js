var wform
var step2Caption;
var step4Caption;
var step2Content;
var step4Content;
$(document).ready(
    function () {
        wform = $("#wizardForm");
        wform.validate({
            errorPlacement: function errorPlacement(error, element) { element.before(error); },
            rules: {
                startDialogCompanPassword1: {
                    equalTo: "#startDialogCompanPassword"
                }
            }
        });
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

        //step 1
        $("#Startdesigner1").prop("checked", userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner1").on("click", function () {

            var _steps = $("#startwizard").steps("getStepsLength");
            alert(_steps);
      /*      step2Caption;
            step4Caption;
            step2Content;
            step4Content;*/

            $('#startwizard').steps('remove', 4);
            $('#startwizard').steps('remove', 1);

        });

        $("#Startdesigner2").prop("checked", !userSettings.clientOnly ? "checked" : "");
        $("#Startdesigner2").on("click", function () {

            $('#startwizard').steps('insert', 1, { title: step2Caption, content: step2Content });
            $('#startwizard').steps('insert', 4, { title: step4Caption, content: step4Content });

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
    switch (currentIndex) {
        case 0:
            wform.validate().settings.ignore = ":disabled,:hidden";
            return wform.valid();
        case 1:
            wform.validate().settings.ignore = ":disabled,:hidden";
            return wform.valid();
        case 2:
            wform.validate().settings.ignore = ":disabled,:hidden";
            return wform.valid();
        case 3:
            wform.validate().settings.ignore = ":disabled,:hidden";
            return wform.valid();
        default:
            break;
    }
    return true;
}
this.onFinishing = function (event, currentIndex) {
    wform.validate().settings.ignore = ":disabled";
    return wform.valid();
}
this.onFinished = function (event, currentIndex) {
    userSettings.wizadFinished = true;
    $("#startDialog").dialog("close");
}