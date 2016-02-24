var helper = require("./objectmodel/utils.js");
var form = require("./objectmodel/form.js");
var fs = require('fs');

var groupField = require("./objectmodel/groupField.js");
var textField = require("./objectmodel/textField.js");
var fieldBase = require("./objectmodel/fieldBase.js");
var listField = require("./objectmodel/listField.js");
var currentDateTimeField = require("./objectmodel/currentDateTimeField.js");
var currentUserField = require("./objectmodel/currentUserField.js");

this.currentForm = null;
this.currentFormDirty = true;
this.dirtyMark = null;
this.tabTitle = null;
this.placeHolder = null;
this.prefix;

this.openForm = function (jsonstring) {

    var loadedObj = JSON.parse(jsonstring);
   
    console.log("Reconstructing objects from loaded JSON.");
    var cnt = 0;
    for (var attrname in loadedObj) { 
        console.log("attrname = " + attrname);
      
        if(attrname=="_children")
            loadChildren(this.currentForm, loadedObj[attrname]);
        else
            this.currentForm[attrname] = loadedObj[attrname];
        cnt++;
    }
    // we need to change id to avoid conflicts if the same form is already oened in editor.
    this.currentForm.regenerateGUID();
    console.log("Done reconstructing objects from loaded JSON.");
    
}
function loadChildren(parent, obj)
{
//    console.log("loadChildren(" + parent +", " + obj +  ")" );

    var field ;
    if(obj._type) 
    {
        switch(obj["_type"])
        {
            case "listField":
                field = Object.create(listField);
                field.ctor();
            break;
            case "textField":
                 field = Object.create(textField);
                field.ctor();
            break;
            case "fieldBase":
                 field = Object.create(fieldBase);
                field.ctor();
            break;        
            case "groupField":
                field = Object.create(groupField);
                field.ctor();
            break;        
            case "currentDateTimeField":
                field = Object.create(currentDateTimeField);
                field.ctor();
            break;
            case "currentUserField":
                field = Object.create(currentUserField);
                field.ctor();
            break;
                     
         }
         parent._children.push(field);
//         console.log("loadChildren() added " + field._type );
         for(var arrayEl in obj)
         {
            
            if(arrayEl=="_children")
                loadChildren(field, obj[arrayEl]);
            else
                field[arrayEl] = obj[arrayEl];
         }
    }
    else{
        // its an array
       for(var arrayEl in obj)
        {
           loadChildren(parent, obj[arrayEl]);
        }
    }

    return;
}
this.newForm = function (name, description, placeHolder, tabCounter, dirtyMark, loadedObj) {
    this.dirtyMark = dirtyMark;
    this.tabTitle = "#tabs a[href='#tabs-"+ tabCounter + "']" ;
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
    
    if(loadedObj)
    {
        this.openForm(loadedObj);
        this.resetDirty();
        $(this.tabTitle).text(this.currentForm.name);

    }
    else
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
    $(this.tabTitle).text(this.currentForm.name);

    this.currentForm.render($("#" + this.prefix + "formPreview"));

}
this.saveForm = function (dirtyMarkId) {
    var success=true;
    var content = JSON.stringify(this.currentForm,null,5);

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
