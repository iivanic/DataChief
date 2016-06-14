var wform
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
        $("#startDialogCompanyName").val(userSettings.organization);
        $("#startDialogCompanPassword").val(userSettings.organizationSecret);
        $("#startDialogCompanPassword1").val(userSettings.organizationSecret);
        //step 2
        $("#startDialogappMode1").prop("checked", userSettings.useSingleAccount?"checked":"");
        $("#startDialogappMode2").prop("checked", !userSettings.useSingleAccount?"checked":"");
       //step 3
        $("#startDialogName").val(userSettings.identitySetting.name);
        $("#startDialogemail").val(userSettings.identitySetting.mainEmail);
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