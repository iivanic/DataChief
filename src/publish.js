/*
--------------------------------------------------------
folders in
app.getPath("userData") + \datachief\[datachiefuser]
are:
--------------------------------------------------------
inbox           -temp folder for recievenig packages
publishers      -this is folder where form templates are 
                 received  after unpacking packages from
                 inbox. Every form is put in subfolder
                 named with publisher name
recieved        -received  half-filled forms from other
                 datachief users in the workflow

prepublish      -prepublish folder - used for designing
                 forms
publish         -forms that are ready to publish
ready           -this is folder with packaes ready to be
                 moved to outbox. Here user can add
                 commands to packages

work            -half filled forms storge
recievedbroadcasts -storage for broadcasts

outbox          -actual outbox (sending folder)
sent            -sent history

myoutbox        -submitted forms from filler thet will go
                 to other users - for preparation of
                 packages

database        -final folder for forms that have
                 completed workflow

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
            helper.confirm("Generate packages and publish forms? Existing packages ready for sending will be deleted.", publishEverything);
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
            clearReady();
        });
    $("#buttonSendPackages").button({
        text: true,
        icons: {
            secondary: "ui-icon-transfer-e-w"
        },
        disabled: true
    })
        .click(function () {
            move2Outbox();
            imap.go();
        });

    $("#commandAddCommandSelectCommand").selectmenu({
        change: function () {
            commandAddCommandSelectCommand_change();
        }
    }
    );

    combo("#commandAddCommandSelectUser");

    $("#buttonAddCommand").button({
        text: true,
        icons: {
            secondary: "ui-icon-plus"
        }
    })
        .click(function () {
            addCommandClick()
        });

    // --------------------------
    // bind command dropdown
    $("#commandAddCommandSelectCommand").html("");
    var commandAddCommandSelectCommandHtml = "";
    var cmds = require("./command.js").cmds;
    for (var i in cmds) {
        commandAddCommandSelectCommandHtml += "<option value='" + cmds[i].id + "'>" + cmds[i].description + "</option>"
    }
    $("#commandAddCommandSelectCommand").html(commandAddCommandSelectCommandHtml);
    // --------------------------

    pplist = $("#prepublishList");
    plist = $("#publishList");
    olist = $("#outboxList");
    llist = $("#logList");
    rlist = $("#readyList");

    //    helper.watchFolder(helper.getPrepublishPath(), prepublishWatchEvent, this);
    //   helper.watchFolder(helper.getPublishPath(), publishWatchEvent, this);

    readFiles();
});
function commandAddCommandSelectCommand_change(e) {

}
function addCommandClick(e, _textmessage) {
    var user = $("#commandAddCommandSelectUser_text").val().trim();
    if(user = 'All users that have packages')
        user = '-1';
    if (user) {
        var command = require("./command.js");
        var c = command.findCommand($("#commandAddCommandSelectCommand").val());
        if (c.id == 0) {
            helper.alert("No command selected.");
            return;
        }
        var textmessage = "";
        if (c.name == "text" && !_textmessage) {
            // command.textmessage = "MESSAGE!";
            helper.input("Enter Your text message (letters, number, dot, exclamation, queastionmark, comma, colon, semicolon and spaces only)", addCommandClick, /^[a-zA-Z_0-9\s\.\!\?\;\,\:]+$/gi, e);
            return;
        }
        if (_textmessage)
            command.textmessage = _textmessage;
        command.ctor(c, command.textmessage, user);
        var content = JSON.stringify(command, null, 2)
        var filename = helper.join(helper.getPublishPath(), "Command_" + command.command.name + "_for_" + user.replace("-1", "all users that have packages") + ".dccommand");
        fs.writeFileSync(filename, content);

        /*, function (err) {
            if (err) {
                console.log("Saving of Command failed. " + err.toString());
            }
        });*/

        $("#commandAddCommandSelectCommand")[0].selectedIndex = 0;
        $("#commandAddCommandSelectCommand").selectmenu("refresh");
        //     $("#commandAddCommandSelectUser")[0].selectedIndex = 0;
        //   $("#commandAddCommandSelectUser").combobox("refresh");
        // combo("#commandAddCommandSelectUser");


        readFiles();
        $("#commandAddCommandSelectUser_text").val("");
    }
    else
        helper.alert("No user selected.");
}

function combo(selector) {
    $.widget("custom.combobox", {
        _create: function () {
            this.wrapper = $("<span>")
                .addClass("custom-combobox")
                .insertAfter(this.element);

            this.element.hide();
            this._createAutocomplete();
            this._createShowAllButton();
        },

        _createAutocomplete: function () {
            var selected = this.element.children(":selected"),
                value = selected.val() ? selected.text() : "";

            this.input = $("<input>")
                .appendTo(this.wrapper)
                .val(value)
                .attr("id", selector.replace("#","") + "_text")
                .attr("title", "")
                .addClass("custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left")
                .autocomplete({
                    delay: 0,
                    minLength: 0,
                    source: $.proxy(this, "_source")
                })
                .tooltip({
                    classes: {
                        "ui-tooltip": "ui-state-highlight"
                    }
                });

            this._on(this.input, {
                autocompleteselect: function (event, ui) {
                    ui.item.option.selected = true;
                    this._trigger("select", event, {
                        item: ui.item.option
                    });
                },

                autocompletechange: "_removeIfInvalid"
            });
        },

        _createShowAllButton: function () {
            var input = this.input,
                wasOpen = false;

            $("<a>")
                .attr("tabIndex", -1)
                .attr("title", "Show All Items")
                .tooltip()
                .appendTo(this.wrapper)
                .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
                .removeClass("ui-corner-all")
                .addClass("custom-combobox-toggle ui-corner-right")
                .on("mousedown", function () {
                    wasOpen = input.autocomplete("widget").is(":visible");
                })
                .on("click", function () {
                    input.trigger("focus");

                    // Close if already visible
                    if (wasOpen) {
                        return;
                    }

                    // Pass empty string as value to search for, displaying all results
                    input.autocomplete("search", "");
                });
        },

        _source: function (request, response) {
            var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
            response(this.element.children("option").map(function () {
                var text = $(this).text();
                if (this.value && (!request.term || matcher.test(text)))
                    return {
                        label: text,
                        value: text,
                        option: this
                    };
            }));
        },

        _removeIfInvalid: function (event, ui) {

            // Selected an item, nothing to do
            if (ui.item) {
                return;
            }

            // Search for a match (case-insensitive)
            var value = this.input.val(),
                valueLowerCase = value.toLowerCase(),
                valid = false;
            this.element.children("option").each(function () {
                if ($(this).text().toLowerCase() === valueLowerCase) {
                    this.selected = valid = true;
                    return false;
                }
            });

            // Found a match, nothing to do
            if (valid) {
                return;
            }
            // allow values not on the list
            return;
            // Remove invalid value
          /*  this.input
                .val("")
                .attr("title", value + " didn't match any item")
                .tooltip("open");
            this.element.val("");
            this._delay(function () {
                this.input.tooltip("close").attr("title", "");
            }, 2500);
            this.input.autocomplete("instance").term = "";*/
        },

        _destroy: function () {
            this.wrapper.remove();
            this.element.show();
        }
    });

    $(selector).combobox();
}
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
function move2Outbox() {
    var ready = helper.getReadyPath();
    var outbox = helper.getOutboxPath()
    var files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        helper.moveFile(helper.join(ready, files[i]), helper.join(outbox, files[i]));
    }
    refreshOutbox();
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

        pplist.append("<input title='" + publish.formInfoString(helper.getPrepublishPath(), files[i]) + "' type='checkbox' onclick='publish.info();if( $(\"#prepublishList input:checked\").length>0){$(\"#buttonDeletePrepublished\").button(\"enable\");$(\"#button2Publish\").button(\"enable\");$(\"#buttonEditPrepublished\").button(\"enable\");} else {$(\"#buttonDeletePrepublished\").button(\"disable\");$(\"#button2Publish\").button(\"disable\");$(\"#buttonEditPrepublished\").button(\"disable\")}' id='pplistItem" + i + "' value='" + helper.join(helper.getPrepublishPath(), files[i]) + "' /> <label for='pplistItem" + i + "'  title='" + publish.formInfoString(helper.getPrepublishPath(), files[i]) + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1)
            + "</label><br>");
    }
    files = helper.getFilesInDir(helper.getPublishPath());
    for (var i in files) {
        console.log("Found published " + files[i]);
        if (files[i].endsWith(".dccommand")) {
            plist.append("<input type='image' style='cursor:pointer;margin-left: 4px;' src='../icons/delete_16.png'  title='Remove " + publish.commandInfoString(helper.getPublishPath(), files[i]) +
                "' onclick='helper.confirm(\"Remove " + publish.commandInfoString(helper.getPublishPath(), files[i]).replace(/\"/gi, "*") + "?\", publish.removeCommand,\"" + escape(helper.join(helper.getPublishPath(), files[i])) + "\" );' id='plistItem" + i + "' value='" + helper.join(helper.getPublishPath(), files[i]) + "' /> <label for='plistItem" + i + "'  title='" + publish.commandInfoString(helper.getPublishPath(), files[i]) + "'>" +
                publish.shortCommandInfoString(helper.getPublishPath(), files[i]) + "</label><br>");
        }
        else {
            plist.append("<input type='checkbox'  title='" + publish.formInfoString(helper.getPublishPath(), files[i]) + "' onclick='publish.info();if( $(\"#publishList input:checked\").length>0){$(\"#button2Prepublish\").button(\"enable\");} else {$(\"#button2Prepublish\").button(\"disable\");}' id='plistItem" + i + "' value='" + helper.join(helper.getPublishPath(), files[i]) + "' /> <label for='plistItem" + i + "'  title='" + publish.formInfoString(helper.getPublishPath(), files[i]) + "'>" +
                files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1) + "</label><br>");
        }
    }
    refreshOutbox();

    // fill readyList
    /*
    files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        console.log("Found ready package " + files[i]);

        rlist.append("<input type='checkbox' onclick='publish.info();if( $(\"#readyList input:checked\").length>0){$(\"#buttonDeletePrepublished\").button(\"enable\");$(\"#button2Publish\").button(\"enable\");$(\"#buttonEditPrepublished\").button(\"enable\");} else {$(\"#buttonDeletePrepublished\").button(\"disable\");$(\"#button2Publish\").button(\"disable\");$(\"#buttonEditPrepublished\").button(\"disable\")}' id='rlistItem" + i + "' value='" + helper.join(helper.getReadyPath(), files[i]) + "' /> <label for='rlistItem" + i + "'>" +
            files[i].substring(files[i].indexOf("_", files[i].indexOf("_") + 1) + 1)
            + "</label><br>");
    }*/
}

this.removeCommand = function (filePath) {
    filePath = unescape(filePath);

    helper.deleteFile(filePath);
    readFiles();
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
    file = helper.loadFile(filename); //.split('START')[1];
    var loadedObj = JSON.parse(helper.decrypt(file, userSettings.identitySetting.userSecret));

}
this.packageinfofortooltip = function (filename) {
    file = helper.loadFile(filename); //.split('START')[1];
    var loadedObj = JSON.parse(helper.decrypt(file, userSettings.identitySetting.userSecret));
    var ret = "Package for " + loadedObj.user + " has " + loadedObj.forms.length + " form(s) and " + loadedObj.commands.length + " command(s).";
    if (loadedObj.forms.length) {
        ret += " Form(s): ";
        for (var i in loadedObj.forms) {
            ret += loadedObj.forms[i]._name + " v" + loadedObj.forms[i]._version + ", ";
        }
        if (ret.endsWith(", "))
            ret = ret.substring(0, ret.length - 2);
        ret += ".";
    }
    if (loadedObj.commands.length) {
        ret += " Command(s): "
        for (var i in loadedObj.commands) {
            ret += loadedObj.commands[i].command.name + (loadedObj.commands[i].textmessage ? " - " + loadedObj.commands[i].textmessage : "") + ", ";
        }
        if (ret.endsWith(", "))
            ret = ret.substring(0, ret.length - 2);
        ret += ".";
    }
    return ret;
}
this.formInfoString = function (path, filename) {

    var file = helper.loadFile(helper.join(path, filename));

    try {
        var loadedObj = JSON.parse(file);
        return loadedObj._name + " v" + loadedObj._version + " is for: " + loadedObj.publishTo.replace(/\,/gi, ', ').replace('  ', ' ');
    }
    catch (ex) {
        return filename + " : " + path + " : " + ex + " : " + file;
    }
}
this.commandInfoString = function (path, filename) {
    var file = helper.loadFile(helper.join(path, filename));
    try {
        var loadedObj = JSON.parse(file);
        return "\"" + loadedObj.command.description + (loadedObj.command.name == 'text' ? " - " + loadedObj.textmessage : "") + "\" command for " + loadedObj.user.replace("-1", "Everyone");
    }
    catch (ex) {
        return filename + " : " + path + " : " + ex + " : " + file;
    }
}
this.shortCommandInfoString = function (path, filename) {
    var file = helper.loadFile(helper.join(path, filename));
    try {
        var loadedObj = JSON.parse(file);
        return "\"" + loadedObj.command.name + "\" command for " + loadedObj.user.replace("-1", "all users that have packages");
    }
    catch (ex) {
        return filename + " : " + path + " : " + ex + " : " + file;
    }
}
function publishEverything() {
    clearReady();
    items = $("#publishList input");
    // add users myoutbox to files
    items.add($("#fillerTreeMyOutbox li"));
    var packages = new Array();
    var pCount = 0;
    var commandsForAll = new Array();
    for (var i = 0; i < items.length; i++) {

        file = helper.loadFile($(items[i]).val());
        var loadedObj = JSON.parse(file);
        var isForm = loadedObj._version;
        if (isForm) {
            //mark form as published - this means it's a template.
            loadedObj.published = true;
            var users = loadedObj.publishTo.split(/[,;]/gi);
            // if form is not template then ...
            if (loadedObj.workflowStep) {
                users = loadedObj.workflow.split(/;/gi);
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
                // no package for user, create it
                if (!packages[users[ui]]) {
                    packages[users[ui]] = { publisher: userSettings.organization, published: true, cameFrom:userSettings.identitySetting.email, user: users[ui], forms: new Array(), commands: new Array(), publishersDigest: helper.publishersDigest() };
                    pCount++;
                }
                //we need history for later...
                if (!loadedObj.history)
                loadedObj.history = new Array();
                loadedObj.history.push({ action: 'Publish', time: new Date(), from: userSettings.identitySetting.email, to: users[ui], step: 0, fromStep: -1  });
                // push form
                packages[users[ui]].forms.push(loadedObj);
            }
        }
        else {
            if (loadedObj.user == "-1") {
                commandsForAll.push(loadedObj);
            }
            else {
                //if package for this user doesnt exists, create it
                if (!packages[loadedObj.user]) {
                    packages[loadedObj.user] = { publisher: userSettings.organization, published: true, cameFrom:userSettings.identitySetting.email,user: loadedObj.user, forms: new Array(), commands: new Array(), publishersDigest: helper.publishersDigest() };
                    pCount++;
                }
                //add command
                packages[loadedObj.user].commands.push(loadedObj);
            }
        }

    }
    // dont forget command for all
    for (var j in commandsForAll) {
        for (var k in packages) {
            packages[k].commands.push(commandsForAll[j]);
        }
    }
    llist.html("");
    helper.log("publishEverything() - <strong>" + pCount + "</strong> Package(s):");

    for (var i in packages) {
        helper.log("Package for user <strong>" + packages[i].user + "</strong> has <strong>" + packages[i].forms.length + "</strong> form(s) and <strong>" + packages[i].commands.length + "</strong> commands(s).");
        savePackage(packages[i])
    }
    refreshOutbox();

}
function savePackage(p) {
    var content =  helper.encrypt(JSON.stringify(p, null, 2), userSettings.identitySetting.userSecret);
    helper.saveTextFile(helper.addNumberPrefix2File(helper.getReadyPath(), p.user), content);
}
this.refreshOutB = refreshOutbox;
function refreshOutbox() {
    //refersh readyList
    rlist.html("");
    var files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        console.log("Found ready packages " + files[i]);
        rlist.append("<input type='hidden' id='rlistItem" + i + "' value='" + helper.join(helper.getReadyPath(), files[i]) + "' /> <label style='cursor:pointer;' title=\"" + publish.packageinfofortooltip(helper.join(helper.getReadyPath(), files[i])) + "\" onclick=\"publish.packageinfo($('#rlistItem" + i + "').val());\" for='rlistItem" + i + "'>" +
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
      //  console.log("Found outboxed " + files[i]);
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
function clearReady() {
    var files = helper.getFilesInDir(helper.getReadyPath());
    for (var i in files) {
        helper.deleteFile(helper.join(helper.getReadyPath(), files[i]));
    }
    refreshOutbox();
}
this.reload = function () {
    // we need to refresh folders...
    // alert("publish.reload()");
}