this.onStepChanging = function (event, currentIndex, newIndex) {
            // form.validate().settings.ignore = ":disabled,:hidden";
            //  return form.valid();
            return true;
        }
this.onFinishing = function (event, currentIndex) {
            //  form.validate().settings.ignore = ":disabled";
            //  return form.valid();
            return true;
        }
this.onFinished = function (event, currentIndex) {
            userSettings.wizadFinished=true;
            $("#startDialog").dialog("close");
        }