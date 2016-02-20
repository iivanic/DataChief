//var winstate = require("./winstate.js");
var formEditor = require("./formEditor.js");
var helper = require("./objectmodel/utils.js");

function getWelcomeMessage(pjson) {
    var ret = "Welcome to " + pjson.name + " v" + pjson.version;
    return ret;

}
function getDescription(pjson) {
    var ret = pjson.description;
    var showdown = require('./showdown-1.3.0/showdown.min');
    var converter = new showdown.Converter();
    var fs = require("fs");
    var path = require("path");
    var data = fs.readFileSync(path.resolve(path.join(__dirname, "../README.MD")));
    ret += "<hr />" + converter.makeHtml(data.toString());;
    return ret;

}

var tabs = null; // $( "#tabs" ).tabs();
var tabCounter = 2;
// actual addTab function: adds new tab using the input from the form above
function addTab(opened) {
    var tabTitle = $("#tab_title"),
        tabContent = $("#tab_content"),
        tabTemplate = "<li><span id='tabs-" + tabCounter + "_dirty' style='color:red;'>*</span><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";

    console.log("tabCounter=" + tabCounter);

    var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label)),
        tabContentHtml = ""; //tabContent.val() || "Tab " + tabCounter + " content.";

    tabs.find(".ui-tabs-nav").append(li);
    tabs.append("<div id='" + id + "'><p>" + tabContentHtml + "</p><div id='" + id + "Form'>FormPlaceHolder</div>");
    var index = $('#' + id).index() - 1;
    console.log("index=" + index);
    tabs.tabs("refresh");

    tabs.tabs("option", "active", index);;
    var newFormEditor = Object.create(formEditor); //Object.create(formEditor);
    if (opened) {
        newFormEditor.openForm(opened, label, tabContent.val(), $('#' + id + "Form"), $('#ui-id-' + tabCounter), $('#tabs-' + tabCounter + '_dirty'));

    }
    else {
        newFormEditor.newForm(label, tabContent.val(), $('#' + id + "Form"), $('#ui-id-' + tabCounter), $('#tabs-' + tabCounter + '_dirty'));
    }
    tabCounter++;

}

$(document).ready(function () {
    var pjson = require('../package.json');
    $('#header').text(getWelcomeMessage(pjson));
    $('#description').html(getDescription(pjson));
    tabs = $("#tabs").tabs();

  
  
    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var newFormDialog = $("#newFormDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            Create: function () {
                addTab();
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            form[0].reset();
        }
    });
 
    // addTab form: calls addTab function on submit and closes the dialog
    var form = newFormDialog.find("form").submit(function (event) {
        addTab();
        newFormDialog.dialog("close");
        event.preventDefault();
    });
 

 
    // addTab button: just opens the dialog
    $("#add_form")
        .button()
        .click(function () {
            newFormDialog.dialog("open");
        });
    $("#open_form")
        .button()
        .click(function () {
            helper.openForm(addTab);


        });
    // close icon: removing the tab on click
    tabs.delegate("span.ui-icon-close", "click", function () {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        tabs.tabs("refresh");
    });

    tabs.bind("keyup", function (event) {
        if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
            var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
            $("#" + panelId).remove();
            tabs.tabs("refresh");
        }
    });


});

var fieldBase = require("./objectmodel/fieldBase.js");
var textField = require("./objectmodel/textField.js");

$(document).ready(function () {
    //  alert(1);
    $("#test").click(
        function (e) {
            var ctlb = Object.create(fieldBase);
            ctlb.ctor();
            console.log(ctlb.id);
            var ctlt = Object.create(textField);
            ctlt.ctor();
            console.log(ctlt.id);
            var ctlt1 = Object.create(textField);
            ctlt1.ctor();
            console.log(ctlt1.id);
            console.log("..................");
        }
        );
});

