var helper = require("./objectmodel/utils.js");
var form = require("./objectmodel/form.js");
var fs = require('fs');

this.currentForm = null;
this.currentFormDirty = true;
this.dirtyMark = null;
this.tabTitle = null;
this.placeHolder = null;
this.prefix;

this.openForm = function (jsonstring, name, description, placeHolder, tabTitle, dirtyMark) {
    alert(jsonstring);
}
this.newForm = function (name, description, placeHolder, tabTitle, dirtyMark) {
    this.dirtyMark = dirtyMark;
    this.tabTitle = tabTitle;
    this.placeHolder = placeHolder;
    this.dirtyMark = dirtyMark;
    this.prefix = placeHolder.attr('id') + "_";
    var htmlTemplate = helper.loadTextFile("../templates/formeditor.html");
    htmlTemplate = htmlTemplate.replace(/prefix_/gi, this.prefix);
    placeHolder.html(htmlTemplate);
    $("#" + this.prefix + "formSave").prop("me", this);
    $("#" + this.prefix + "formSave")
        .button()
        .click(function () {
            this.me.saveForm(this.me.dirtyMark.attr('id'));
        });

    this.currentForm = Object.create(form);
    this.currentForm.ctor();
    this.currentForm.createExampleForm(name, description);
    this.currentForm.render($("#" + this.prefix + "formPreview"));

    $('#' + this.prefix + 'propGrid').jqPropertyGrid(this.currentForm, this.currentForm._propsMeta);
    $("#" + this.prefix + "formReset").prop("me", this);
    $("#" + this.prefix + "formReset")
        .button()
        .click(function () {
            this.me.resetFormChanges();
        });

    $("#" + this.prefix + "formApply").prop("me", this);
    $("#" + this.prefix + "formApply")
        .button()
        .click(function () {
            this.me.applyFormChanges();
        });



}
this.resetFormChanges = function () {
    $('#' + this.prefix + 'propGrid').jqPropertyGrid(this.currentForm, this.currentForm._propsMeta);
    this.currentForm.render($("#" + this.prefix + "formPreview"));

}
this.applyFormChanges = function () {
    // In order to get back the modified values:
    var theNewObj = $('#' + this.prefix + 'propGrid').jqPropertyGrid('get');
    //copy properties to form
    for (var attrname in theNewObj) { this.currentForm[attrname] = theNewObj[attrname]; }
    this.tabTitle.text(this.currentForm.name);

    this.currentForm.render($("#" + this.prefix + "formPreview"));

}
this.saveForm = function (dirtyMarkId) {
    var success=true;
    var content = JSON.stringify(this.currentForm);

    dialog.showSaveDialog(
        {   title: "Save " + this.currentForm.name,
            defaultPath: this.currentForm.name,
            filters: [
            { name: 'DataChief Form', extensions: ['DataChiefForm'] },
            { name: 'All files', extensions: ['*'] },
    ]},
    function (fileName) {
        if (fileName === undefined) return;
        fs.writeFile(fileName, content, function (err) {
            if(err)
                {
                console.log("Saving failed. " + err.toString());
                success=false;}
            
        });
        if(success)
            $("#" + dirtyMarkId).hide();

    });
}
this.resetDirty = function () {
    this.dirtyMark.hide();
}
this.setDirty = function () {
    this.dirtyMark.show();
}
