
$(document).ready(function () {
    sent.refreshSent();
});

this.movePackageToSent = function (file) {
    reciever = helper.getOnlyFileName(file).substring(6)
    var jsonstring = helper.loadFile(file);
    jsonstring = jsonstring.split('START')[1];
    var loadedObj = JSON.parse(helper.decrypt(jsonstring, userSettings.identitySetting.userSecret));
    var type = "";
    if (loadedObj.published)
        type = "PUBLISHED";
    if (loadedObj.workflowpackage)
        type = "WORKFLOW";

    if (loadedObj.broadcastpackage)
        type = "BROADCAST";

    //Handle commands if exists.
    for (var i in loadedObj.commands) {
        //execute commands..
        var cmd = require("./command.js");

        //cmd.ctor(loadedObj.commands[i].command, loadedObj.commands[i].textmessage, loadedObj.commands[i].user)
        // Filename format
        // COMMAND_NAME_USER
        var destination1 = helper.join(helper.getSentPath(),
            "COMMAND" + "_" + loadedObj.commands[i].command.name + "_" + reciever);
        helper.saveTextFile(destination1, JSON.stringify(loadedObj.commands[i]));

    }

    // forms
    for (var i in loadedObj.forms) {

        var formName = loadedObj.forms[i]._name;
        var version = loadedObj.forms[i]._version;
        var initiator = loadedObj.forms[i].initiator;
        var workflowStep = loadedObj.forms[i].workflowStep;
        if (!workflowStep)
            workflowStep = 0;
        var id = loadedObj.forms[i]._id;

        // Filename format
        // TYPE_FORMID__FORMVERSION_FORMNAME_..RECIEVER.._STEP
        var destination = helper.join(
            helper.getSentPath(),
            type + "_" + id + "_" + version + "_" + formName + ".." + reciever + ".." + helper.formatDateForFileName(new Date()) + "_" + workflowStep
        );
        //ensure no overwrite
        if (helper.fileExists(destination)) {
            var cnt = 0;
            while (helper.fileExists(destination + "_" + cnt))
                cnt++;
            destination = destination + "_" + cnt;
        }
        //save anly forms that have permission to be kept.
        var allowedUsersToHaveLocalCopies = loadedObj.forms[i].allowLocalCopies.toLowerCase().replace(/;/gi,',').split(/,/gi ) ;
        if(
            (allowedUsersToHaveLocalCopies.indexOf("everyone") > -1 || allowedUsersToHaveLocalCopies.indexOf(userSettings.identitySetting.email)> -1 || type == "PUBLISHED")
            ||
            (allowedUsersToHaveLocalCopies.indexOf("initiator") > -1 && loadedObj.forms[i].initiator== userSettings.identitySetting.email )
        )
            helper.saveTextFile(destination, JSON.stringify(loadedObj.forms[i]));

    }

    sent.refreshSent();
}
this.refreshSent = function () {
    dataCollection.refreshSentDB();
}
