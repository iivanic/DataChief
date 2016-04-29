
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
});

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
            fhtml += "            <li><span style='cursor:pointer;' onclick='alert(2);' href='#'>" + forms[j] + "</span></li>"
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
        html += " <li><span style='cursor:pointer;width:100%' href='#'>" + recieved[i] + "</span";
    }
    if (recieved.length == 0) {
        html += " <li><span style='cursor:not-allowed;width:100%' href='#'>No forms in folder</span";
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