var fs = require("fs");
var path = require("path");
//var helper = require("./objectmodel/utils.js");

var pplist;
var plist;
var olist;
var slist;
var llist;

$(document).ready(function() {

    $("#button2Publish").button({
        text: true,
        icons: {
            secondary: "ui-icon-arrow-1-e"
        },
        disabled: true
    })
        .click(function() {
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
        .click(function() {
            helper.confirm("Open in Editor?", openInEditor);
        });
    $("#button2Prepublish").button({
        text: true,
        icons: {
            primary: "ui-icon-arrow-1-w"
        },
        disabled: true
    })
        .click(function() {
            //helper.confirm("Move back to Prepublish Folder?", move2Prepublished);
            move2Prepublished();
        });
    $("#buttonPublish").button({
        text: true,
        icons: {
            secondary: "ui-icon-arrow-1-e"
        }
    })
        .click(function() {
            helper.confirm("Generate packages and publish forms?", publishEverything);
        });

    $("#buttonDeletePrepublished").button({
        text: true,
        icons: {
            primary: "ui-icon-trash"
        },
        disabled: true
    })
        .click(function() {
            helper.confirm("Delete?", deletePrepublished)
        });
    $("#buttonClearOutbox").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        },
        disabled: true
    })
        .click(function() {
            clearOutbox();
        });
    $("#buttonSendPackages").button({
        text: true,
        icons: {
            secondary: "ui-icon-transfer-e-w"
        },
        disabled: true
    })
        .click(function() {
            imap.go();
        });


    pplist = $("#prepublishList");
    plist = $("#publishList");
    olist = $("#outboxList");
    llist = $("#logList");

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
}


this.refreshFolders = readFiles;

this.info = function() {
    llist.html("");
    var items = $("#prepublishList input:checked");
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        helper.log("<strong>" + loadedObj._name + " v" + loadedObj._version + "</strong> will be published to: <strong>" + loadedObj.publishTo + "</strong>");

    }
    items = $("#publishList input:checked");
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        helper.log("<strong>" + loadedObj._name + " v" + loadedObj._version + "</strong> will be published to: <strong>" + loadedObj.publishTo + "</strong>");

    }
}
this.packageinfo = function(filename) {
    file = helper.loadFile(filename);
    var loadedObj = JSON.parse(file);
    helper.log("Package for <strong>" + loadedObj.user + "</strong> has <strong>" + loadedObj.forms.length + "</strong> form(s) and <strong>" + loadedObj.commands.length + "</strong> command(s).");

}
function publishEverything() {
    items = $("#publishList input");
    var packages = new Array();
    var pCount = 0;
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        var users = loadedObj.publishTo.split(",");
        for (var ui = 0; ui < users.length; ui++) {
            if (!packages[users[ui]]) {
                packages[users[ui]] = { user: users[ui], forms: new Array(), commands: new Array() };
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
    var content = JSON.stringify(p, null, 2);
    helper.saveTextFile(helper.addNumberPrefix2File(helper.getOutboxPath(), p.user), content);
}
this.refreshOutB = refreshOutbox;
function refreshOutbox() {
    olist.html("");
    var files = helper.getFilesInDir(helper.getOutboxPath());
    for (var i in files) {
        console.log("Found outboxed " + files[i]);
        olist.append("<input type='hidden' class='hasmenu' id='olistItem" + i + "' value='" + helper.join(helper.getOutboxPath(), files[i]) + "' /> <label onclick=\"publish.packageinfo($('#olistItem" + i + "').val());\" class='hasmenu' for='olistItem" + i + "'>" +
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

}
function clearOutbox() {
    var files = helper.getFilesInDir(helper.getOutboxPath());
    for (var i in files) {
        helper.deleteFile(helper.join(helper.getOutboxPath(), files[i]));
    }
    refreshOutbox();
}