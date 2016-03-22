var fs = require("fs");
var path = require("path");
var helper = require("./objectmodel/utils.js");

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
            helper.confirm("Move to Publish Folder?", move2Published);
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
            helper.confirm("Move back to Prepublish Folder?", move2Prepublished);
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

    pplist = $("#prepublishList");
    plist = $("#publishList");
    olist = $("#outboxList");
    llist = $("#logList");

    //    helper.watchFolder(helper.getPrepublishPath(), prepublishWatchEvent, this);
    //   helper.watchFolder(helper.getPublishPath(), publishWatchEvent, this);
    publish.log("Welcome to Data Chief.");
    readFiles();
}
);
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
function publishEverything() {
    alert("pubish everything!");
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
    olist.html("");
    var files = helper.getFilesInDir(helper.getPrepublishPath());
    for (var i in files) {
        publish.log("Found prepublished " + files[i]);

        pplist.append("<input type='checkbox' onclick='if( $(\"#prepublishList input:checked\").length>0){$(\"#buttonDeletePrepublished\").button(\"enable\");$(\"#button2Publish\").button(\"enable\");$(\"#buttonEditPrepublished\").button(\"enable\");} else {$(\"#buttonDeletePrepublished\").button(\"disable\");$(\"#button2Publish\").button(\"disable\");$(\"#buttonEditPrepublished\").button(\"disable\")}' id='pplistItem" + i + "' value='" + helper.join(helper.getPrepublishPath(), files[i]) + "' /> <label for='pplistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1)
            + "</label><br>");
    }
    files = helper.getFilesInDir(helper.getPublishPath());
    for (var i in files) {
        publish.log("Found published " + files[i]);
        plist.append("<input type='checkbox' onclick='if( $(\"#publishList input:checked\").length>0){$(\"#button2Prepublish\").button(\"enable\");} else {$(\"#button2Prepublish\").button(\"disable\");}'id='plistItem" + i + "' value='" + helper.join(helper.getPublishPath(), files[i]) + "' /> <label for='plistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1) + "</label><br>");
    }
    files = helper.getFilesInDir(helper.getOutboxPath());
    for (var i in files) {
        publish.log("Found outboxed " + files[i]);
        olist.append("<input type='checkbox' id='plistItem" + i + "' value='" + helper.join(helper.getOutboxPath(), files[i]) + "' /> <label for='plistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1) + "</label><br>");
    }
}
function prepublishWatchEvent(event, filename) {
    publish.log("Prepublish folder: " + filename + ": " + event);
    switch (event) {
        case "rename":
            break;
        case "change":
            break;
    }
}
function publishWatchEvent(event, filename) {
    publish.log("Publish folder: " + filename + ": " + event);
    switch (event) {
        case "rename":
            break;
        case "change":
            break;
    }
}
this.log = function(txt) {

    llist.append(new Date().toLocaleString() + ": " + txt + "<br>");
    llist.scrollTop(llist[0].scrollHeight);
    console.log(txt);
}
this.refreshFolders = readFiles;
