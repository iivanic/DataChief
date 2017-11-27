var formDisplay = require("./formDisplay.js");

var tabs;
var tabTitle = "";
var tabContent = "";
var tabTemplate = "<li><span id='{dirty}' style='color:red;'>*</span><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";
var tabCounter = 1;

$(document).ready(function () {
    $("#btnSendRecieve").button({
        text: true,
        icons: {
            secondary: "ui-icon-refresh"
        }
    })
        .click(function () {
            filler.sendRecieve();
        });
    filler.refreshFolders();

    tabs = $("#Fillertabs").tabs();


    tabs.delegate("span.ui-icon-close", "click", function () {
        //     var panelId = $(this).closest("li").remove().attr("aria-controls") + "_dirty";
        var el = $(this).closest("li");
        var panelId = el.attr("aria-controls") + "_dirty";

        if ($("#" + panelId).css('display') != 'none' && $("#" + panelId)[0]) {
            $("#dialog-confirm-remove-fillertab").dialog({
                resizable: false,
                height: 225,
                modal: true,
                buttons: {
                    "Close Form": function () {

                        el.remove()
                        $("#" + panelId.replace("_dirty", "")).remove();
                        tabs.tabs("refresh");
                        $(this).dialog("close");
                    },
                    Cancel: function () {
                        $(this).dialog("close");
                    }
                }
            });
        }
        else {
            el.remove()
            $("#" + panelId.replace("_dirty", "")).remove();
            tabs.tabs("refresh");

        }

    });

    /*
        tabs.bind("keyup", function (event) {
            if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
                var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
                $("#" + panelId).remove();
                tabs.tabs("refresh");
            }
        });*/

});
// this function check wather form is already opn (needed for work folder, recieved folder)
this.checktab = function (title, filename) {
    // var formid = helper.getOnlyFileName(filename).substring(0, 36);
    var formid = "";
    var loadedObj = JSON.parse(helper.loadFile(filename));
    formid = loadedObj.formid;

    var openFormsSel = $("[id^=\"Fillertabs-\"]");
    var cnt = 0;
    for (var i = 0; i < openFormsSel.length; i++) {

        var f = $(openFormsSel[i]).prop("current");
        if (f) {
            if ($(openFormsSel[i]).attr("id").match(/^Fillertabs-\d+$/gi)) {
                cnt++;
                if (f.formid == formid) {
                    //form already open, .. activate its tab
                    tabs.tabs("option", "active", cnt);
                    tabs.tabs("refresh");
                    return;
                }

            }
        }

    }
    this.addtab(title, filename);
}
// actual addTab function: adds new tab using the input from the form above
this.addtab = function (title, filename) {

    tabCounter++;
    var label = title || "Tab " + tabCounter,
        id = "Fillertabs-" + tabCounter,
        li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label).replace("{dirty}", "Fillertabs-" + tabCounter + "_dirty")),
        tabContentHtml = tabContent || "Tab " + tabCounter + " content.";

    tabs.find(".ui-tabs-nav").append(li);
    tabs.append("<div id='" + id + "' class='fixmyheight'><div id='" + id + "DisplayForm'>FormPlaceHolder</div></div>");
    tabs.tabs("refresh");
    tabs.tabs("option", "active", -1);

    index.FixTabsHeight();

    var newFormDisplay = Object.create(formDisplay); //Object.create(formEditor);

    newFormDisplay.newForm(label, $('#' + id + "DisplayForm"), tabCounter, $('#Fillertabs-' + tabCounter + '_dirty'), filename);
}

this.removeTab = function (currentFormDirty) {
    var id = currentFormDirty.attr("id").replace("_dirty", "");
    $("#" + id).remove();
    $("[aria-controls=\"" + id + "\"]").remove();
    tabs.tabs("refresh");

}

this.sendRecieve = function () {
    createPackagesFromMyOutbox();
    imap.test1 = this;
    imap.callback1 = this.sendRecieveDone;
    imap.go();
}
this.sendRecieveDone = function (error, self) {
    imap.test1 = null;
    imap.callback1 = null;
    dataCollection.refreshDB();
    dataCollection.refreshBroadcastDB();
    dataCollection.refreshSentDB();
    self.refreshFolders();

}
this.refreshFolders = function () {
    // we need to refresh all folders
    var publishers = helper.getDirectories(helper.getPublishersPath());
    // autmatic installation of feedback form does not makes sense
    // becouse of communication method, must be in "Per user account"
    // mode, so that emails are actually sent
    // -- removed for now
    /*   if (publishers.indexOf("DataChief") == -1) {
           // create folder for DataCheif publisher
           helper.checkFolder(helper.join(helper.getPublishersPath(), "DataChief"));
           // create feedback form
           var form = require("./objectmodel/form.js");
           form.createFeedbackForm();
           form.published = true;
           var version = form._version;
           var id = form._id;
           var content = JSON.stringify(form, index._formEditor.saveJSONReplacer, 2);
   
           var fileName = helper.join(helper.join(helper.getPublishersPath(), "DataChief"), "N" + "_" + id + "_" + version + "_" + form._name);
           helper.saveTextFile(
               fileName,
               content);
           helper.log("----FeedbackForm saved as " + fileName);
   
           //read folders again
           publishers = helper.getDirectories(helper.getPublishersPath());
       }
       */
    var html = "";
    for (var i in publishers) {
        /*   <li><a style="width:100%" href="#">Publisher 1</a>
                                           <ul>
                                               <li>Test1</li>
                                               <li>tewt</li>
                                           </ul>
                                       </li>
                                       */
        html += " <li><a style='width:100%' href='#'>" + publishers[i];

        forms = helper.getFilesInDir(helper.join(helper.getPublishersPath(), publishers[i]))
        var fhtml = "";

        for (var j in forms) {
            var path = helper.join(helper.getPublishersPath(), publishers[i]);
            //   alert(path);
            //   path = path.replace(/\\/g, "\\\\");
            //   alert(path);   
            fhtml += "            <li><span style='cursor:pointer;' onclick=\"filler.addtab('" + forms[j].split("_")[3] + "', '" + helper.join(path, forms[j]).replace(/\\/g, "\\\\") + "')\" href='#" + forms[j] + "'>" +
                (forms[j].substring(0, 1) == 'N' ? "<img style='width:37px;height:15px;' src='../icons/new-icon-37x15.png'>" : (forms[j].substring(0, 1) == 'U' ? "<img style='width:55px;height:15px;' src='../icons/updated-icon-55x15.png'>" : "")) + forms[j].split("_")[3] + "</span></li>"
        }
        if (forms.length == 0) {
            fhtml += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span></li>";
        }

        html += "(" + forms.length + ")</a>" +
            "       <ul>" + fhtml;
        html += "        </ul>" +
            "    </li>";
    }
    $("#fillerTreePublishedToMe").html(html);
    html = "";
    var recieved = helper.getFilesInDir(helper.getRecievedPath());
    for (var i in recieved) {
        html += " <li><span style='cursor:pointer;width:100%' onclick=\"filler.checktab('" + recieved[i].split("_")[recieved[i].split("_").length - 1] + "', '" + helper.join(helper.getRecievedPath(), recieved[i]).replace(/\\/g, "\\\\") + "')\" href='" + recieved[i] + "'>" + recieved[i].split("_")[recieved[i].split("_").length - 1] + "</span></li>";
    }
    if (recieved.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span></li>";
    }
    $("#fillerTreeRecieved").html(html);
    html = "";

    var work = helper.getFilesInDir(helper.getWorkPath());
    for (var i in work) {
        html += " <li><span style='cursor:pointer;width:100%' onclick=\"filler.checktab('" + work[i].split("_")[1] + "', '" + helper.join(helper.getWorkPath(), work[i]).replace(/\\/g, "\\\\") + "')\" href='#" + work[i] + "'>" + work[i].substring(37) + "</span></li>";
    }
    if (work.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span></li>";
    }
    $("#fillerTreeWork").html(html);
    html = "";

    var myoutbox = helper.getFilesInDir(helper.getMyOutboxPath());
    if (myoutbox.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No items in folder</span></li>";
    }

    for (var i in myoutbox) {
        html += " <li><span style='cursor:not-allowed;width:100%' value='" + helper.join(helper.getMyOutboxPath(), myoutbox[i]).replace(/\\/g, "\\\\") + "'>" + myoutbox[i].substring(37) + "</span></li>";
    }

    $("#fillerTreeMyOutbox").html(html);
    html = "";

    var sent = helper.getFilesInDir(helper.getSentPath());
    var sentC = 0;
    var sentB = 0;
    var sentP = 0;
    for (var i in sent) {
        if (sent[i].substring(0, 5) == "WORKF")
            sentC++;
        if (sent[i].substring(0, 5) == "BROAD")
            sentB++;
        if (sent[i].substring(0, 5) == "PUBLI")
            sentP++;
    }
    var sLabel = "No sent forms.";
    if (sentB || sentC || sentP)
        sLabel = "";
    if (sentC)
        sLabel += "Submitted <strong>" + sentC + "</strong> form(s). "
    if (sentP)
        sLabel += "<strong>" + sentP + "</strong> published. "
    if (sentB)
        sLabel += "<strong>" + sentB + "</strong> boradcast(s). "
    if (sentB || sentC || sentP)
        sLabel += "<strong>" + sent.length + "</strong> in total.";

    html += " <li><span style='cursor:pointer;width:100%' onclick='$(\"#maintabs\").tabs({ active: 3 });$(\"#collectortabs\").tabs({ active: 1 })'>" + sLabel + "</span></li>";
    /*  if (sent.length == 0) {
          html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span></li>";
      }
      */
    $("#fillerTreeSent").html(html);

    index._initMenu();

}
this.reload = function () {

    // we need to refresh all displayed forms
    var tabs = $("[id^='Fillertabs-']");
    for (var t = 0; t < tabs.length; t++) {
        var tab = $(tabs[t]);
        if (tab.attr("id").match(/^Fillertabs-\d+$/gi)) {
            var f = tab.prop("current");
            f._lastUser = userSettings.identitySetting.email + (f.published ? ", initiator" : "");
            f.refresh();
            helper.log("Refreshing opened forms in filler: " + f.name);
        }
    }
    this.refreshFolders();
}

function createPackagesFromMyOutbox() {
    var srcFolder = helper.getMyOutboxPath();
    var items = helper.getFilesInDir(srcFolder);
    var packages = new Array();
    var pCount = 0;
    var pCountBR = 0;

    for (var i = 0; i < items.length; i++) {
        file = helper.loadFile(helper.join(srcFolder, items[i]));
        var loadedObj = JSON.parse(file);
        var broadcastRecevers = helper.parseBroadCastRecievers(loadedObj.broadCastRecievers, loadedObj.initiator);
        var users = helper.parseWorkFlow(loadedObj.workflow);
        // find workflow step 
        if (users.length < loadedObj.workflowStep) {
            // or send it to final reciver
            users = loadedObj.finalStep;
            loadedObj.finished = true;
        }
        else {
            // if returning to initiator
            if (loadedObj.workflowStep - 1 < 0) {
                users = loadedObj.initiator;
            }
            else {
                // find workflow step 
                users = users[loadedObj.workflowStep - 1];
            }
            if (users instanceof Array) {
                //multiple options for this step, we need to display step chooser
                helper.alert("Not yet supported!");
                return;
            }

        }
        if (!(users instanceof Array)) {
            var t = users;
            users = new Array();
            users.push(t);
        }
        for (var ui = 0; ui < users.length; ui++) {
            // no package for user, create it
            if (!packages[users[ui]]) {
                packages[users[ui]] = { publisher: userSettings.organization, published: false, workflowpackage: true, cameFrom: userSettings.identitySetting.email, user: users[ui], forms: new Array(), commands: new Array(), publishersDigest: helper.publishersDigest() };
                pCount++;
            }
            //we need history for later
            if (!loadedObj.history)
                loadedObj.history = new Array();
            loadedObj.history.push({ action: 'Submit', time: new Date(), from: userSettings.identitySetting.email, to: users[ui], step: (loadedObj.workflowStep ? loadedObj.workflowStep : 0), fromStep: loadedObj.fromWorkflowStep ? loadedObj.fromWorkflowStep : 0 });
            // push form
            packages[users[ui]].forms.push(loadedObj);
        }
        //broadcast!

        for (var ui = 0; ui < broadcastRecevers.length; ui++) {
            // no package for user, create it
            if (!packages[broadcastRecevers[ui]]) {
                packages[broadcastRecevers[ui]] = { publisher: userSettings.organization, published: false, broadcastpackage: true, workflowpackage: true, cameFrom: userSettings.identitySetting.email, user: broadcastRecevers[ui], forms: new Array(), commands: new Array(), publishersDigest: helper.publishersDigest() };
                pCountBR++;
            }
            //we need history for later
            if (!loadedObj.history)
                loadedObj.history = new Array();
            loadedObj.history.push({ action: 'Broadcast', time: new Date(), from: userSettings.identitySetting.email, to: broadcastRecevers[ui].replace("[BROADCAST]", ''), step: (loadedObj.workflowStep ? loadedObj.workflowStep : 0), fromStep: loadedObj.fromWorkflowStep ? loadedObj.fromWorkflowStep : 0 });


            var clone = jQuery.extend(true, {}, loadedObj);
            clone.broadcast = true;
            // push form
            packages[broadcastRecevers[ui]].forms.push(clone);

        }
        helper.deleteFile(helper.join(srcFolder, items[i]));
    }

    helper.log("createPackagesFromMyOutbox() - packages <strong>" + pCount + "</strong>, broadcast packages: <strong>" + pCountBR + "</strong>.");

    for (var i in packages) {
        if(!packages[i].user)
        {
            console.log("createPackagesFromMyOutbox() Error: no user!")
        }
        helper.log("Package for user <strong>" + packages[i].user + "</strong> has <strong>" + packages[i].forms.length + "</strong> form(s).");
        savePackage(packages[i], (i.substring(0, 5) == "[BROA" ? i : packages[i].user));
    }
    filler.reload();

}
function savePackage(p, user) {
    var content = "START" + helper.encrypt(JSON.stringify(p, null, 2), userSettings.identitySetting.userSecret);
    if (p.user.replace(/\[BROADCAST\]/gi,"") == userSettings.identitySetting.email) {
        // we are sending package to ourself!
        var filename = helper.join(helper.getInboxPath(), "XXXXXX" + user ); //helper.generateGUID());
        helper.saveTextFile(filename, content);
        //recieve immmidietly
        sent.movePackageToSent(filename);
        package.loadPackages();
        
       
        filler.sendRecieveDone  (null, filler);
    }
    else
        helper.saveTextFile(helper.addNumberPrefix2File(helper.getOutboxPath(), user), content);
}