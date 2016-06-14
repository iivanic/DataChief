var wform
$(document).ready(
    function () {
        wform = $("#wizardForm");
        /*      wform.validate({
                  errorPlacement: function errorPlacement(error, element) { element.before(error); },
                  rules: {
                      confirm: {
                          equalTo: "#password"
                      }
                  }
              });
      */
        //    startWizard();
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

        $("#startDialogCompanyName").val(userSettings.organization);
        $("#startDialogCompanPassword").val(userSettings.organizationSecret);
        $("#startDialogCompanPassword1").val(userSettings.organizationSecret);

    }
)
this.onStepChanging = function (event, currentIndex, newIndex) {

    // wform = $("#wizardForm");
    // form.validate().settings.ignore = ":disabled,:hidden";
    //  return form.valid();

    // allow step back even id current step is not valid
    if (currentIndex > newIndex) {
        return true;
    }
    switch (currentIndex) {
        case 0:
            //    wform.validate().settings.ignore = ":disabled,:hidden";
            var valid = wform[0].checkValidity();

            if (valid) {
                userSettings.organization = $("#startDialogCompanyName").val();
                userSettings.organizationSecret = $("#startDialogCompanPassword").val();
                if ($("#startDialogCompanPassword1").val() != $("#startDialogCompanPassword").val())
                    valid = false;
            }
            return valid;

        case 1:
            alert(2);
            break;
        case 2:
            alert(3);
            break;
        case 3:
            alert(4);
            break;
        default:
            break;
    }
    return true;
}
this.onFinishing = function (event, currentIndex) {
    //  form.validate().settings.ignore = ":disabled";
    //  return form.valid();
    return true;
}
this.onFinished = function (event, currentIndex) {
    userSettings.wizadFinished = true;
    $("#startDialog").dialog("close");
}