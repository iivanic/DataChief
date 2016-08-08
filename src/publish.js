/*
--------------------------------------------------------
folders in
app.getPath("userData") + \datachief\[datachiefuser]
are:
--------------------------------------------------------
inbox           -temp folder for recievenig packages
publishers      -this is folder where form templates are 
                 recieved after unpacking packages from
                 inbox. Every form is put in subfolder
                 named with publisher name
recieved        -recieved half-filled forms from other
                 datachief users in the workflow

prepublish      -prepublish folder - used for designing
                 forms
publish         -forms that are ready to publish
ready           -this is folder with packaes ready to be
                 moved to outbox. Here user can add
                 commands to packages

work            -half filled forms storge
recievedbroadcasts -storage for broadcasts

outbox          --actual outbox (sending folder)
sent            -sent history

myoutbox        -???
---------------------------------------------------------
 */

var fs = require("fs");
var path = require("path");
//var helper = require("./objectmodel/utils.js");

var pplist;
var plist;
var olist;
var slist;
var llist;

$(document).ready(function () {

    $("#button2Publish").button({
        text: true,
        icons: {
            secondary: "ui-icon-arrow-1-e"
        },
        disabled: true
    })
        .click(function () {
            //helper.confirm("Move to Publish Folder?", move2Published);
            move2Published();
        });
    $("#buttonEditPrepublished").button({
        text: true,
        icons: {
            secondary: "ui-icon-pencil"
        },
        disabled: true
    })
        .click(function () {
            helper.confirm("Open in Editor?", openInEditor);
        });
    $("#button2Prepublish").button({
        text: true,
        icons: {
            primary: "ui-icon-arrow-1-w"
        },
        disabled: true
    })
        .click(function () {
            //helper.confirm("Move back to Prepublish Folder?", move2Prepublished);
            move2Prepublished();
        });
    $("#buttonPublish").button({
        text: true,
        icons: {
            secondary: "ui-icon-arrow-1-e"
        }
    })
        .click(function () {
            helper.confirm("Generate packages and publish forms?", publishEverything);
        });

    $("#buttonDeletePrepublished").button({
        text: true,
        icons: {
            primary: "ui-icon-trash"
        },
        disabled: true
    })
        .click(function () {
            helper.confirm("Delete?", deletePrepublished)
        });
    $("#buttonClearOutbox").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        },
        disabled: true
    })
        .click(function () {
            clearOutbox();
        });
    $("#buttonSendPackages").button({
        text: true,
        icons: {
            secondary: "ui-icon-transfer-e-w"
        },
        disabled: true
    })
        .click(function () {
            imap.go();
        });


    pplist = $("#prepublishList");
    plist = $("#publishList");
    olist = $("#outboxList");
    llist = $("#logList");
    rlist = $("#readyList");

    //    helper.watchFolder(helper.getPrepublishPath(), prepublishWatchEvent, this);
    //   helper.watchFolder(helper.getPublishPath(), publishWatchEvent, this);

    readFiles();
});
function deletePrepublished() {
    var items = $("#prepublishList input:checked");
    for (var i = 0; i < items.length; i++) {
        helper.deleteFile($(items[i]).val());
        $(items[i]).next().next().remove();
        $(items[i]).next().remove();
        $(items[i]).remove();

    }

}
function move2Prepublished() {
    var items = $("#publishList input:checked");
    for (var i = 0; i < items.length; i++) {
        helper.moveFile($(items[i]).val(), helper.join(helper.getPrepublishPath(), helper.getOnlyFileName($(items[i]).val())));
        /*     $(items[i]).next().next().remove();
             $(items[i]).next().remove()
             $(items[i]).remove();
     */
    }
    if (items.length > 0)
        readFiles();

}
function move2Published() {
    var items = $("#prepublishList input:checked");
    for (var i = 0; i < items.length; i++) {
        helper.moveFile($(items[i]).val(), helper.join(helper.getPublishPath(), helper.getOnlyFileName($(items[i]).val())));
        /*     $(items[i]).next().next().remove();
             $(items[i]).next().remove();
             $(items[i]).remove();
     */
    }
    if (items.length > 0)
        readFiles();


}
function openInEditor() {
    var items = $("#prepublishList input:checked");
    for (var i = 0; i < items.length; i++) {
        index.AddTab(
            helper.loadFile($(items[i]).val()).toString());
    }
    index.activateEditorTab();
}
function readFiles() {
    $("#button2Publish").button("disable");
    $("#buttonEditPrepublished").button("disable")
    $("#buttonDeletePrepublished").button("disable");
    $("#button2Prepublish").button("disable")

    pplist.html("");
    plist.html("");   
    rlist.html("");

    var files = helper.getFilesInDir(helper.getPrepublishPath());
    for (var i in files) {
        console.log("Found prepublished " + files[i]);

        pplist.append("<input type='checkbox' onclick='publish.info();if( $(\"#prepublishList input:checked\").length>0){$(\"#buttonDeletePrepublished\").button(\"enable\");$(\"#button2Publish\").button(\"enable\");$(\"#buttonEditPrepublished\").button(\"enable\");} else {$(\"#buttonDeletePrepublished\").button(\"disable\");$(\"#button2Publish\").button(\"disable\");$(\"#buttonEditPrepublished\").button(\"disable\")}' id='pplistItem" + i + "' value='" + helper.join(helper.getPrepublishPath(), files[i]) + "' /> <label for='pplistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1)
            + "</label><br>");
    }
    files = helper.getFilesInDir(helper.getPublishPath());
    for (var i in files) {
        console.log("Found published " + files[i]);
        plist.append("<input type='checkbox' onclick='publish.info();if( $(\"#publishList input:checked\").length>0){$(\"#button2Prepublish\").button(\"enable\");} else {$(\"#button2Prepublish\").button(\"disable\");}'id='plistItem" + i + "' value='" + helper.join(helper.getPublishPath(), files[i]) + "' /> <label for='plistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1) + "</label><br>");
    }
    refreshOutbox();

    // fill readyList
    files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        console.log("Found ready package " + files[i]);

        rlist.append("<input type='checkbox' onclick='publish.info();if( $(\"#readyList input:checked\").length>0){$(\"#buttonDeletePrepublished\").button(\"enable\");$(\"#button2Publish\").button(\"enable\");$(\"#buttonEditPrepublished\").button(\"enable\");} else {$(\"#buttonDeletePrepublished\").button(\"disable\");$(\"#button2Publish\").button(\"disable\");$(\"#buttonEditPrepublished\").button(\"disable\")}' id='rlistItem" + i + "' value='" + helper.join(helper.getReadyPath(), files[i]) + "' /> <label for='rlistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1)
            + "</label><br>");
    }
}


this.refreshFolders = readFiles;

this.info = function () {
    llist.html("");
    var items = $("#prepublishList input:checked");
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        helper.log("<strong>PREPUBLISH: " + loadedObj._name + " v" + loadedObj._version + "</strong> would be published to: <strong>" + loadedObj.publishTo + "</strong>");

    }
    items = $("#publishList input:checked");
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        helper.log("<strong>PUBLISH: " + loadedObj._name + " v" + loadedObj._version + "</strong> will be publishe in package for: <strong>" + loadedObj.publishTo + "</strong>");

    }
}
this.packageinfo = function (filename) {
    file = helper.loadFile(filename).split('START')[1];
    var loadedObj = JSON.parse(helper.decrypt(file, userSettings.identitySetting.userSecret));  
    helper.log("Package for <strong>" + loadedObj.user + "</strong> has <strong>" + loadedObj.forms.length + "</strong> form(s) and <strong>" + loadedObj.commands.length + "</strong> command(s).");

}
function publishEverything() {
    items = $("#publishList input");
    // add users myoutbox to files
    items.add($("#fillerTreeMyOutbox li"));
    var packages = new Array();
    var pCount = 0;
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        //mark form as published - this means it's a template.
        loadedObj.published = true;
        var users = loadedObj.publishTo.split(",");
        // if form is not template then ...
        if (loadedObj.workflowStep) {
            users = loadedObj.workflow.split(";");
            // find workflow step 
            if (users.length < loadedObj.workflowStep) {
                // or send it to final reciver
                users = loadedObj.finalStep;
            }
            else {
                // find workflow step 
                users = users[loadedObj.workflowStep - 1];
            }
        }
        for (var ui = 0; ui < users.length; ui++) {
            if (!packages[users[ui]]) {
                packages[users[ui]] = { publisher: userSettings.organization, published: true, user: users[ui], forms: new Array(), commands: new Array(), publishersDigest: helper.publishersDigest() };
                pCount++;
            }
            packages[users[ui]].forms.push(loadedObj);
        }
    }
    llist.html("");
    helper.log("<strong>" + pCount + "</strong> Package(s):");

    for (var i in packages) {
        helper.log("Package for user <strong>" + packages[i].user + "</strong> has <strong>" + packages[i].forms.length + "</strong> form(s) and <strong>" + packages[i].commands.length + "</strong> commands(s).");
        savePackage(packages[i])
    }
    refreshOutbox();

}
function savePackage(p) {
    var content = "START" + helper.encrypt(JSON.stringify(p, null, 2), userSettings.identitySetting.userSecret);
    helper.saveTextFile(helper.addNumberPrefix2File(helper.getReadyPath(), p.user), content);
}
this.refreshOutB = refreshOutbox;
function refreshOutbox() {
    //refersh readyList
    rlist.html("");
    var files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        console.log("Found ready packages " + files[i]);
        rlist.append("<input type='hidden' class='hasmenu' id='rlistItem" + i + "' value='" + helper.join(helper.getReadyPath(), files[i]) + "' /> <label onclick=\"publish.packageinfo($('#rlistItem" + i + "').val());\" class='hasmenu' for='rlistItem" + i + "'>" +
            files[i] + "</label><br>");
    }
       if (files.length > 0) {
        $("#buttonClearOutbox").button("enable");
        $("#buttonSendPackages").button("enable");
        bindPackageContextMenu();
    }
    else {
        $("#buttonClearOutbox").button("disable");
        $("#buttonSendPackages").button("disable");
    }

    //refersh outbox
    olist.html("");
    files = helper.getFilesInDir(helper.getOutboxPath());
    for (var i in files) {
        console.log("Found outboxed " + files[i]);
        olist.append("<input type='hidden'  id='olistItem" + i + "' value='" + helper.join(helper.getOutboxPath(), files[i]) + "' /> <label onclick=\"publish.packageinfo($('#olistItem" + i + "').val());\"  for='olistItem" + i + "'>" +
            files[i] + "</label><br>");
    }
 
}
function clearOutbox() {
    var files = helper.getFilesInDir(helper.getOutboxPath());
    for (var i in files) {
        helper.deleteFile(helper.join(helper.getOutboxPath(), files[i]));
    }
    refreshOutbox();
}

this.reload = function () {
    // we need to refresh folders...
    // alert("publish.reload()");
}