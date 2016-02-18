var helper = require("./objectmodel/utils.js");
var forms = new Array();

this.newForm = function (name, description, placeHolder, tabTitle, dirtyMark) {
    var prefix = placeHolder.attr('id') + "_";
    var htmlTemplate = helper.loadTextFile("../templates/formeditor.html");
    htmlTemplate = htmlTemplate.replace(/prefix_/gi, prefix);
    placeHolder.html(htmlTemplate);
    $("#" + prefix + "formSave")
        .button()
        .click(function () {
            alert("save");
        });
    $("#" + prefix + "formProperties_name").val(name);
    $("#" + prefix + "formProperties_description").val(description);
    $("#" + prefix + "formProperties_name").change(function (e) { 
        //alert(e.value);
        tabTitle.text($("#" + prefix + "formProperties_name").val());
        });

}