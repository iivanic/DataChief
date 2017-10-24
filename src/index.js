
var form = require("./objectmodel/form.js");
var formEditor = require("./formEditor.js");

this._formEditor = formEditor;

function getWelcomeMessage(pjson) {
    var ret = "Welcome to " + pjson.name + " v" + pjson.version;
    return ret;

}
function getDescription(pjson) {
    var ret = "";
    var showdown = require('./showdown-1.3.0/showdown.min');
    var converter = new showdown.Converter();
    var fs = require("fs");
    var path = require("path");
    var data = fs.readFileSync(path.resolve(path.join(__dirname, "../README.md")));
    ret += converter.makeHtml(data.toString());;
    return ret;

}
function getCaseStudy() {
    var ret = "";
    var showdown = require('./showdown-1.3.0/showdown.min');
    var converter = new showdown.Converter();
    var fs = require("fs");
    var path = require("path");
    var data = fs.readFileSync(path.resolve(path.join(__dirname, "../Case study Barrique Works LLC.md")));
    ret += converter.makeHtml(data.toString());;
    return ret;

}

var tabs = null; // $( "#tabs" ).tabs();
var maintabs = null;
var abouttabs = null;

var tabCounter = 2;
// actual addTab function: adds new tab using the input from the form above
this.AddTab = addTab;

this.startWizard = function () {
    $("#startDialog").dialog({
        height: 680,
        width: "80%",
        modal: true,
        closeOnEscape: false,
        dialogClass: "no-close",
        position: { my: "center", at: "center", of: window }
    });
}

function addTab(opened, exampleName) {
    //check if form is already open
    //TODO we actually deserialize twice, should be only once
    if (opened)
        if ($("#field_dcform_" + JSON.parse(opened)._id).length > 0) {

            helper.alert("Form already open!");
            return false;
        }
    var tabTitle = $("#tab_title"),
        tabContent = $("#tab_content"),
        tabTemplate = "<li><span id='tabs-" + tabCounter + "_dirty' style='color:red;'>*</span><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";

    console.log("tabCounter=" + tabCounter);

    var label = tabTitle.val() || "Tab " + tabCounter,
        id = "tabs-" + tabCounter,
        li = $(tabTemplate.replace(/#\{href\}/g, "#" + id).replace(/#\{label\}/g, label)),
        tabContentHtml = ""; //tabContent.val() || "Tab " + tabCounter + " content.";
    //tabs.append(li);
    tabs.find(".ui-tabs-nav").append(li);
    tabs.append("<div id='" + id + "'><p>" + tabContentHtml + "</p><div id='" + id + "Form'>FormPlaceHolder</div>");
    tabs.tabs("refresh");
    //  var index = $('#' + id).index() - 1;
    //  console.log("index=" + index + ", id=" + id);

    tabs.tabs("option", "active", -1);
    var newFormEditor = Object.create(formEditor); //Object.create(formEditor);
    if (opened) {
        newFormEditor.newForm(label, $('#' + id + "Form"), tabCounter, $('#tabs-' + tabCounter + '_dirty'), opened);

    }
    else {
        newFormEditor.newForm(label, $('#' + id + "Form"), tabCounter, $('#tabs-' + tabCounter + '_dirty'), null, exampleName);
    }
    tabCounter++;
    fixTabsHeight();


}
var boolfix = false;

$(document).ready(function () {
    // enable nice tooltips
    $(document).tooltip();
    userSettings.toGui();
    var shell = require('electron').shell;
    //open links externally by default
    $(document).on('click', 'a[href^="http"]', function (event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });


    var pjson = require('../package.json');
    $('#header').text(getWelcomeMessage(pjson));
    $('#description').html(getDescription(pjson));
    $('#casestudy').html(getCaseStudy());
    $(document).on("click", 'a[href*="Case study Barrique Works LLC.md"]',
        function (event) {
            try {
                abouttabs.tabs("option", "active", 1);
            }
            catch (e) {
                alert(e);
            }
            event.preventDefault();
        });
    //fix path to graph
    $('img[src*="/dc_workflow.png"]').attr("src", "../dc_workflow.png");

    maintabs = $("#maintabs").tabs()

    tabs = $("#tabs").tabs();
    abouttabs = $("#abouttabs").tabs();

    $("#about_ver").text(pjson.version);
    $("#about_author").text(pjson.author);
    $("#about_lic").text(pjson.license);

    //bind built in forms
    $("#exampleforms").html("");
    var tmpList = form.exampleForms;
    for (var a in tmpList) {
        $("#exampleforms").append($('<option>', {
            value: tmpList[a],
            text: tmpList[a]
        }));
    }
    // modal dialog init: custom buttons and a "close" callback resetting the form inside
    var newFormDialog = $("#newFormDialog").dialog({
        autoOpen: false,
        modal: true,
        width: "480px",

        buttons: {
            
            "Create Emtpy": function () {
                addTab(false, "");
                $(this).dialog("close");
            },
            "Create from template": {
                text: "Create from template",
                id: "btnCreateFromTemplate",
                click : function () {
                    addTab(false, $("#exampleforms").val());
                    $(this).dialog("close");
                }
            },
            
                Cancel: function () {
                $(this).dialog("close");
            }
        
        }
    });


    // addTab form: calls addTab function on submit and closes the dialog
    //    var form = newFormDialog.find("form").submit(function (event) {
    //        addTab();
    //        newFormDialog.dialog("close");
    //        event.preventDefault();
    //    });



    // addTab button: just opens the dialog
    $("#add_form")
        .button()
        .click(function () {
            $("#tab_title").val("My Form");
            newFormDialog.dialog("open");
            if (!boolfix)
                $("#exampleforms").selectmenu();
            boolfix = true;

        });
    $("#open_form")
        .button()
        .click(function () {
            helper.openForm(addTab);
        });
    // close icon: removing the tab on click
    tabs.delegate("span.ui-icon-close", "click", function () {
        //     var panelId = $(this).closest("li").remove().attr("aria-controls") + "_dirty";
        var el = $(this).closest("li");
        var panelId = el.attr("aria-controls") + "_dirty";
        if ($("#" + panelId).css('display') != 'none') {
            $("#dialog-confirm-remove-tab").dialog({
                resizable: false,
                height: 185,
                modal: true,
                buttons: {
                    "Delete Form": function () {
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

    tabs.bind("keyup", function (event) {
        if (event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE) {
            var panelId = tabs.find(".ui-tabs-active").remove().attr("aria-controls");
            //  $("#" + panelId).remove();
            tabs.tabs("refresh");
        }
    });
    $("#tabs").on("tabsactivate", function (event, ui) {
        fixTabsHeight();
    });
    $("#maintabs").on("tabsactivate", function (event, ui) {
        fixTabsHeight();
    });

    $(window).resize(function () {
        fixTabsHeight();
    });

    $(window).trigger('resize');
    // MenuTree.walk();
    $(window).load(function () {
        fixTabsHeight();
        if (userSettings.clientOnly)
            helper.disableEditor();
        else
            helper.enableEditor();
    })

});
this.closeTab = function (el) {
    //remove tab
    $("li[aria-controls='" + el + "']").remove();
    $("#" + el).remove();
    tabs.tabs("refresh");
    //activate some tab
    tabs.tabs("option", "active", -1);
    //activate publish tab
    maintabs.tabs("option", "active", 1);
    publish.refreshFolders();
}
this.activateEditorTab = function () {
    maintabs.tabs("option", "active", 0);
}
this.FixTabsHeight = fixTabsHeight;
function fixTabsHeight() {

    var winH = $(window).outerHeight();
    /*   $('#tabs-1').each(function() {
           if ($(this).attr("id").lastIndexOf("tabs-", 0) == 0) {
               $(this).height(winH - $(this).offset().top - 55);
               $(this).css("overflow", "auto");
           }
       });*/
    $('.fixmyheight').each(function () {
        $(this).height(winH - $(this).offset().top - 66 - ($("#expandlog").hasClass("ui-icon-arrow-1-n") ? 0 : 100)); //- $("#maintabs-1").position().top- 20);
        $(this).css("overflow", "auto");
    });

}
var fieldBase = require("./objectmodel/fieldBase.js");
var textField = require("./objectmodel/textField.js");

$(document).ready(function () {
    $(document).keydown(keydown);
    var params = document.location.href.split('?');
    /*  if (params.length > 0) {
          if (params[1] != 'editor')
              toggleEditor();
      }
      else
          toggleEditor();*/
    $(expandlog).click(expandlog_click);

    helper.log("Welcome to Data Chief.");
    helper.log("Ready.");
    
        //check command line 
    helper.checkCommandLine();
});

function expandlog_click() {

    if ($("#expandlog").hasClass("ui-icon-arrow-1-n")) {
        $("#logrow").height($("#logrow").height() + 100);
        $("#expandlog").removeClass("ui-icon-arrow-1-n");
        $("#expandlog").addClass("ui-icon-arrow-1-s");
        $("#sendingpanel").show();
    }
    else {
        $("#logrow").height($("#logrow").height() - 100);
        $("#expandlog").removeClass("ui-icon-arrow-1-s");
        $("#expandlog").addClass("ui-icon-arrow-1-n");
        $("#sendingpanel").hide();
        // position scroll
        $("#logList").animate({ scrollTop: $("#logList")[0].scrollHeight }, 0);

    }
    fixTabsHeight();
}

function toggleEditor() {
    if ($("a[href='#maintabs-1']").parent().css('display') != 'none') {
        helper.disableEditor();
    }
    else {
        helper.enableEditor();
    }

}
function keydown(e) {
    if (e.keyCode == 69 && e.ctrlKey) {
        //Ctrl + e
        toggleEditor();
    }
}
var MenuTree;
initMenu();
this._initMenu = initMenu;
function initMenu() {

    MenuTree = {
        collapse: function (element) {

            element.slideToggle(250);

        },

        walk: function () {

            $('a', '#fillerTree').each(function () {

                var $a = $(this);
                var $li = $a.parent();

                if ($a.next().is('ul')) {

                    var $ul = $a.next();
                    $a.off("click");
                    $a.click(function (e) {

                        e.preventDefault();

                        MenuTree.collapse($ul);
                        $a.toggleClass('active');

                    });

                }



            });


        }
    };
    MenuTree.walk();
}
this.reloadEditor = function () {
    // we need to refresh all displayed forms
    //  alert("index.reloadEditor()");
}




