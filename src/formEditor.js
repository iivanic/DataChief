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
    $("#" + this.prefix + "impersonateUser").autocomplete({
        source: userSettings.userList
    })
        .val(userSettings.email);   
        // change na radi dobro na jquery ui autocomplete
    $("#" + this.prefix + "impersonateUser").blur(function () {
        
               var u=$("#" + this.me.prefix + "impersonateUser").val();
        var isEdit = $("#" + this.me.prefix + "editormode").val()=="edit"?true:false;
        //maintein suggestion list
        if( userSettings.userList.indexOf(u)<0)
        {
            userSettings.userList.push(u);
            userSettings.save();
            $("#" + this.me.prefix + "impersonateUser").source=userSettings.userList;
        }
        
        this.me.currentForm.render($("#" + this.me.prefix + "formPreview"),
                    isEdit
                    ,u);
         // in preview mode reset propertygrid
         if(!isEdit)
             $('#' + this.me.currentForm.placeHolderPrefix + 'propGrid').jqPropertyGrid(new Object(), null);
         else{
             markSelected(this.me.currentForm);
             var sel = $('#' + this.me.prefix + 'propGrid').prop("current");
             $('#' + this.me.currentForm.placeHolderPrefix + 'propGrid').jqPropertyGrid(sel, sel._propsMeta);
         }
        
    })
    $("#" + this.prefix + "impersonateUser").prop("me", this);
    $("#" + this.prefix + "editormode").selectmenu(
        {
        change: function( event, data ) {
          var u=$("#" + this.me.prefix + "impersonateUser").val();
        var isEdit = $("#" + this.me.prefix + "editormode").val()=="edit"?true:false;
               this.me.currentForm.render($("#" + this.me.prefix + "formPreview"),
                    isEdit
                    ,u);
                        // in preview mode reset propertygrid
         if(!isEdit)
             $('#' + this.me.currentForm.placeHolderPrefix + 'propGrid').jqPropertyGrid(new Object(), null);
         else
         {
             markSelected(this.me.currentForm);
             var sel = $('#' + this.me.prefix + 'propGrid').prop("current");
             $('#' + this.me.currentForm.placeHolderPrefix + 'propGrid').jqPropertyGrid(sel, sel._propsMeta);
         }
            
       }}
    );

    $("#" + this.prefix + "editormode").prop("me", this);

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
        
    this.currentForm.render($("#" + this.prefix + "formPreview"),
        $("#" + this.prefix + "editormode").val()=="edit"?true:false
        ,$("#" + this.prefix + "impersonateUser").val());

    $('#' + this.prefix + 'propGrid').jqPropertyGrid(this.currentForm, this.currentForm._propsMeta);
    $('#' + this.prefix + 'propGrid').prop("current", this.currentForm);
    markSelected(this.currentForm);
/*     $("#" + this.prefix + "formReset").prop("me", this);
   $("#" + this.prefix + "formReset")
        .button()
        .click(function () {
            this.me.resetFormChanges();
        });
*/
    $("#" + this.prefix + "formApply").prop("me", this);
    $("#" + this.prefix + "formApply")
        .button()
        .click(function () {
            this.me.applyFormChanges();
        });



}
/*this.resetFormChanges = function () {
    $('#' + this.prefix + 'propGrid').jqPropertyGrid(this.currentForm, this.currentForm._propsMeta);
    this.currentForm.render($("#" + this.prefix + "formPreview"));

}
*/
this.applyFormChanges = function () {
    // in preview mode do nothing    
     var isEdit = $("#" + this.prefix + "editormode").val()=="edit"?true:false;
     if(!isEdit)
        return;
    // In order to get back the modified values:
    var pgrid=$('#' + this.prefix + 'propGrid');
    var theNewObj = pgrid.jqPropertyGrid('get');
    //copy properties to form
    var isDirty = false;
    for (var attrname in theNewObj) { 
        if(pgrid.prop("current")[attrname] != theNewObj[attrname])
            isDirty=true;
        pgrid.prop("current")[attrname] = theNewObj[attrname];
         }
    if(isDirty)
        this.setDirty();
        
    $(this.tabTitle).text(this.currentForm.name);
    this.currentForm.refresh();
    markSelected(this.currentForm);
    if(isDirty)
        this.setDirty();
}
function SaveJSONReplacer(key,value)
{
    if (key=="_form") return undefined;
    else if (key=="_parent") return undefined;
    else if (key=="_lastPlaceholder") return undefined;
    else if (key=="_lastEditable") return undefined;
    else if (key=="_lastUser") return undefined;
    else return value;
}

this.saveForm = function (dirtyMarkId) {
    var success=true;
    var content = JSON.stringify(this.currentForm,SaveJSONReplacer,5);

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
