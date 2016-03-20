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
        }
    })
        .click(function() {
            alert("2 publish");
        });
    $("#button2Prepublish").button({
        text: true,
        icons: {
            primary: "ui-icon-arrow-1-w"
        }
    })
        .click(function() {
            alert("2 prepublish");
        });
    $("#buttonPublish").button({
        text: true,
        icons: {
            secondary: "ui-icon-arrow-1-e"
        }
    })
        .click(function() {
            alert("publish");
        });

    pplist = $("#prepublishList");
    plist = $("#publishList");
    olist = $("#outboxList");
    llist = $("#logList");
    
    helper.watchFolder(helper.getPrepublishPath(), prepublishWatchEvent, this);
    publish.log("Welcome to Data Chief.");
}
);

function prepublishWatchEvent(event, filename) {
    publish.log(filename + ": " + event);
    switch (event) {
        case "rename":
            break;
        case "change":
            break;

    }

}
this.log = function(txt)
{

    llist.append(new Date().toLocaleString() + ": " + txt + "<br>");
    llist.scrollTop(llist[0].scrollHeight);
    console.log(text);
}
