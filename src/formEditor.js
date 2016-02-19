var helper = require("./objectmodel/utils.js");
var form = require("./objectmodel/form.js");
var forms = new Array();
var currentForm=null;

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
    
    var currentForm = Object.create(form);
    currentForm.ctor();
    currentForm.createExampleForm(name, description);
    currentForm.render($("#"  + prefix + "formPreview"));

}