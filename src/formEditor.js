var helper = require("./objectmodel/utils.js");
var form = require("./objectmodel/form.js");
var forms = new Array();

var currentForm=null;
this.currentFormDirty=true;
this.dirtyMark = null;

this.newForm = function (name, description, placeHolder, tabTitle, dirtyMark) {
    this.dirtyMark = dirtyMark;
    var prefix = placeHolder.attr('id') + "_";
    var htmlTemplate = helper.loadTextFile("../templates/formeditor.html");
    htmlTemplate = htmlTemplate.replace(/prefix_/gi, prefix);
    placeHolder.html(htmlTemplate);
    $("#" + prefix + "formSave")
        .button()
        .click(function () {
            saveForm();
        });
 //   $("#" + prefix + "formProperties_name").val(name);
 //   $("#" + prefix + "formProperties_description").val(description);
    $("#" + prefix + "formProperties_name").change(function (e) { 
        //alert(e.value);
        tabTitle.text($("#" + prefix + "formProperties_name").val());
        });
    
    currentForm = Object.create(form);
    currentForm.ctor();
    currentForm.createExampleForm(name, description);
    currentForm.render($("#"  + prefix + "formPreview"));
    
    $('#'  + prefix + 'propGrid').jqPropertyGrid(currentForm, currentForm._propsMeta);

    $("#" + prefix + "formReset")
        .button()
        .click(function () {
            resetFormChanges(prefix);
        });

    $("#" + prefix + "formApply")
        .button()
        .click(function () {
            applyFormChanges(prefix, tabTitle);
       });



}
function resetFormChanges(prefix)
{
    $('#'  + prefix + 'propGrid').jqPropertyGrid(currentForm, currentForm._propsMeta);
            currentForm.render($("#"  + prefix + "formPreview"));

}
function applyFormChanges(prefix, tabTitle)
{
                // In order to get back the modified values:
            var theNewObj = $('#'  + prefix + 'propGrid').jqPropertyGrid('get');
            //copy properties to form
             for (var attrname in theNewObj) { currentForm[attrname] = theNewObj[attrname]; }
             tabTitle.text(currentForm.name);

            currentForm.render($("#"  + prefix + "formPreview"));

}
function saveForm()
{
    alert(JSON.stringify(currentForm));
    resetDirty();
}
function resetDirty()
{
    this.dirtyMark.hide();
}
function setDirty()
{
    this.dirtyMark.show();
}