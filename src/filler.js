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
        if ($("#" + panelId).css('display') != 'none') {
            $("#dialog-confirm-remove-fillertab").dialog({
                resizable: false,
                height: 225,
                modal: true,
                buttons: {
                    "Close Form": function () {
                        console.log(2);
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

// actual addTab function: adds new tab using the input from the form above
this.addtab = function(title, filename) {
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

this.sendRecieve = function () {

    imap.go();
}
this.refreshFolders = function () {
    // we need to refresh all folders
    var publishers = helper.getDirectories(helper.getPublishersPath());
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
            fhtml += "            <li><span style='cursor:pointer;' onclick=\"filler.addtab('" + forms[j].split("_")[3] + "', '" +  helper.join(path, forms[j]).replace(/\\/g, "\\\\") + "')\" href='#" + forms[j] + "'>" +
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
        html += " <li><span style='cursor:pointer;width:100%' href='#'>" + recieved[i] + "</span></li>";
    }
    if (recieved.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span></li>";
    }
    $("#fillerTreeRecieved").html(html);
    html = "";

    var work = helper.getFilesInDir(helper.getWorkPath());
    for (var i in work) {
        html += " <li><span style='cursor:pointer;width:100%' href='#'>" + work[i] + "</span";
    }
    if (work.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span";
    }
    $("#fillerTreeWork").html(html);
    html = "";
    var sent = helper.getFilesInDir(helper.getSentPath());

    for (var i in sent) {
        html += " <li><span style='cursor:pointer;width:100%' href='#'>" + sent[i] + "</span";
    }
    if (sent.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span";
    }
    $("#fillerTreeSent").html(html);

    index._initMenu();

}