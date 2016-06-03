//var helper = require("./objectmodel/utils.js");
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
       
        if(attrname=="_children" )
            loadChildren(this.currentForm, loadedObj[attrname], attrname);
        else
            this.currentForm[attrname] = loadedObj[attrname];
        cnt++;
    }
    // we need to change id to avoid conflicts if the same form is already oened in editor.
    //this.currentForm.regenerateGUID();
    console.log("Done reconstructing objects from loaded JSON.");
    return true;
}

function loadChildren(parent, obj, aname, sec)
{
    console.log("loadChildren(" + parent +", " + obj +  ", " + aname + ")" );

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

        if (aname == "_children")
        {   
            parent._children.push(field);
            console.log("added to _children");
        }
        if (aname == "_dataRows")
        {   
            parent._dataRows[parent._dataRows.length-1].push(field);
            console.log("added to _dataRows [" + parent._dataRows.length-1 + "]");
        }
        if (aname == "_newRowTemplate")
         {   
                 parent._newRowTemplate.push(field);
           console.log("added to _newRowTemplate");
        }
         for(var arrayEl in obj)
         {
            
            if (arrayEl == "_children" || arrayEl == "_dataRows" || arrayEl == "_newRowTemplate") 
            {
                loadChildren(field, obj[arrayEl], arrayEl, false);
            }    
            else
            {
                field[arrayEl] = obj[arrayEl];
                console.log("copy "+ arrayEl)
            } 
        }
    }
    else{
        // its an array
       for(var arrayEl in obj)
       {
   
             if (aname == "_dataRows" && !sec)
             {
                    parent._dataRows.push(new Array());
                   // dataRowsCounter ++;
                    loadChildren(parent, obj[arrayEl], aname, true);
 
             }
             else
                  loadChildren(parent, obj[arrayEl], aname);
       }
    }

    return;
}
//remove duplicates from array
function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
this.setImpersonationList = function()
{
     var tmpList = new Array();
     var tmpSteps = this.currentForm.workflow.split(";");
     for(var i=0; i<tmpSteps.length; i++)
     {
         var tmpS = tmpSteps[i].split(",")
         for(var j=0; j<tmpS.length; j++)
         {
             tmpList.push(tmpS[j]);
         }
     }
     tmpList = tmpList.concat(tmpList,this.currentForm._allUsersForImpersonation );
 
     tmpList.push(userSettings.email);
   
     tmpSteps = this.currentForm.allowLocalCopies.split(';');
     for(var i=0; i<tmpSteps.length; i++)
     {
         tmpList.push(tmpSteps[i]);
     }
     tmpSteps = this.currentForm.broadCastRecievers.split(';')
     for(var i=0; i<tmpSteps.length; i++)
     {
         tmpList.push(tmpSteps[i]);
     }
     tmpSteps = this.currentForm.finalStep.split(';')
     for(var i=0; i<tmpSteps.length; i++)
     {
         tmpList.push(tmpSteps[i]);
     }
     
      //remove duplicates
     tmpList=uniq(tmpList);
     //filter out empties
     tmpList = tmpList.filter(function (value, index, array1){return value.trim().length>0});
        
       try
      {$("#" + this.prefix + "impersonateUser").selectmenu( "destroy" );}
      catch(ex){}

      var oldVal = $("#" + this.prefix + "impersonateUser").val();
     $("#" + this.prefix + "impersonateUser").html("");
       
     for(var a in  tmpList)
     {
            $("#" + this.prefix + "impersonateUser").append($('<option>', {
                value: tmpList[a],
                text: tmpList[a]
            }));
     }
     $("#" + this.prefix + "impersonateUser").val(oldVal);
     if($("#" + this.prefix + "impersonateUser").val()==null)
        $("#" + this.prefix + "impersonateUser").prop("selectedIndex",0);
     
      $("#" + this.prefix + "impersonateUser").selectmenu( {
        change: function () {
        
        var u=$("#" + this.me.prefix + "impersonateUser").val();
        var isEdit = $("#" + this.me.prefix + "editormode").val()=="edit"?true:false;
        
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
        
    }});
    $("#" + this.prefix + "impersonateUser").prop("me", this);

}
this.newForm = function (name, placeHolder, tabCounter, dirtyMark, loadedObj, exampleTemplateName) {
    this.dirtyMark = dirtyMark;
    this.tabTitle = "#tabs a[href='#tabs-"+ tabCounter + "']" ;
    this.placeHolder = placeHolder;
    this.dirtyMark = dirtyMark;
    this.prefix = placeHolder.attr('id') + "_";
    var htmlTemplate = helper.loadTextFile("../templates/formeditor.html");
    htmlTemplate = htmlTemplate.replace(/prefix_/gi, this.prefix);
    placeHolder.html(htmlTemplate);
        
    
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
        this.currentForm.createForm(name,exampleTemplateName );
 
    var u=$("#" + this.prefix + "impersonateUser").val();
    if(u == null)
        u=userSettings.email;
        
    this.currentForm.render($("#" + this.prefix + "formPreview"),
        $("#" + this.prefix + "editormode").val()=="edit"?true:false
        ,u);

    $('#' + this.prefix + 'propGrid').jqPropertyGrid(this.currentForm, this.currentForm._propsMeta);
    $('#' + this.prefix + 'propGrid').prop("current", this.currentForm);
    markSelected(this.currentForm);

    this.setImpersonationList();
  //  $("#" + this.prefix + "impersonateUser")
  //      .val(userSettings.email);   

    $("#" + this.prefix + "formApply").prop("me", this);
    $("#" + this.prefix + "formApply")
        .button()
        .click(function () {
            this.me.applyFormChanges();
        });
    this.bindSaveButton();
}

this.applyFormChanges = function () {
    // in preview mode do nothing    
     var isEdit = $("#" + this.prefix + "editormode").val()=="edit"?true:false;
     if(!isEdit)
        return;
    // In order to get back the modified values:
    var pgrid=$('#' + this.prefix + 'propGrid');
    var theNewObj = pgrid.jqPropertyGrid('get');
    //copy properties to form
    var isDirty = false
    // if _repeater has changes, set trtough theproperty, so swap can be triggered
    if(pgrid.prop("current")["_repeater"]!=undefined)
        if(pgrid.prop("current")["_repeater"]!=theNewObj["_repeater"])
        {
              pgrid.prop("current").repeater = theNewObj["_repeater"];
              isDirty=true;
        }
     //copy objects
    for (var attrname in theNewObj) { 
        if(pgrid.prop("current")[attrname] != theNewObj[attrname])
            isDirty=true;
        pgrid.prop("current")[attrname] = theNewObj[attrname];
         }
    if(isDirty)
        this.setDirty();
        
    $(this.tabTitle).text(this.currentForm.name);
    this.currentForm.checkSettings();
    pgrid.jqPropertyGrid(this.currentForm, this.currentForm._propsMeta)
    this.currentForm.refresh();
    markSelected(this.currentForm);
    if(isDirty)
        this.setDirty();
    
    this.setImpersonationList();
       
}

this.saveJSONReplacer = SaveJSONReplacer;

function SaveJSONReplacer(key,value)
{
    /*
    exclude also:
    _lastCumulativeId
    _handleRenderStyleCounter
    _maxHandleRenderStyleCounter
    _allUsersForImpersonation
    validator
    placeHolderPrefix
    idprefix
     */
    if (key=="_form") return undefined;
    else if (key=="_parent") return undefined;
    else if (key=="_lastCumulativeId") return undefined;
    else if (key=="_handleRenderStyleCounter") return undefined;
    else if (key=="_maxHandleRenderStyleCounter") return undefined;
    else if (key=="_allUsersForImpersonation") return undefined;
    else if (key=="validator") return undefined;
    else if (key=="_lastPlaceholder") return undefined;
    else if (key=="placeHolderPrefix") return undefined;
    else if (key=="idprefix") return undefined;
    else if (key=="_lastEditable") return undefined;
    else if (key=="_lastUser") return undefined;
    else return value;
}

this.saveForm = function (dirtyMarkId) {
    var success=true;
    var content = JSON.stringify(this.currentForm, SaveJSONReplacer,2);

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

this.bindSaveButton = function(){
    $("#" + this.prefix + "selectSave").button({
          text: true,
          icons: {
            secondary : "ui-icon-triangle-1-s"
          }
        })
        .click(function() {
          var menu = $( this ).parent().next().show().position({
            my: "left top",
            at: "left bottom",
            of: this
          });
          $( document ).one( "click", function() {
            menu.hide();
          });
          return false;
        })
        .parent()
          .buttonset()
          .next()
            .hide()
            .menu();
            
        
    $("#" + this.prefix + "selectSave_save").prop("me", this);
    $("#" + this.prefix + "selectSave_save")
      //  .button()
    .click(function () {
            this.me.saveForm(this.me.dirtyMark.attr('id'));
        });
    $("#" + this.prefix + "selectSave_prepublish").prop("me", this);
    $("#" + this.prefix + "selectSave_prepublish")
      //  .button()
    .click(function () {
            this.me.prepublish(this.me.dirtyMark.attr('id'));
        });
        
    $("#" + this.prefix + "selectSave_publish").prop("me", this);
    $("#" + this.prefix + "selectSave_publish")
      //  .button()
    .click(function () {
            this.me.publish(this.me.dirtyMark.attr('id'));
        });
};
this.prepublish = function(dirtyMarkId)
{
    var success=true;
    this.currentForm.version = Math.abs(this.currentForm.version)+1;
    var content = JSON.stringify(this.currentForm,SaveJSONReplacer,2);

    var p=helper.getPrepublishPath();
    var fileName = this.currentForm.id + "_" + this.currentForm.version + "_" + this.currentForm.name;
    //fileName = helper.ensureFileNameUnique(p,fileName);
    // check if exists in prebublished
    var files = helper.getFilesInDir(helper.getPrepublishPath());
    
    for(var i in files)
    {
        if(files[i].substring(0,files[i].indexOf('_')) == fileName.substring(0,fileName.indexOf('_') ))
        {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring( files[i].indexOf('_')+1, files[i].indexOf("_",files[i].indexOf('_')+1) );
            if(Math.abs(this.currentForm.version)> Math.abs(ver))
            {
                // ok its an older version
                // delete it
                 fs.unlink(helper.join(helper.getPrepublishPath(), files[i]));
            }
            else
            {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Prepublish folder! Please save this form as a copy to disk and investigate.")
                return;
            }
            
        }
    }
    
   // check if exists in published
    files = helper.getFilesInDir(helper.getPublishPath());
    
    for(var i in files)
    {
        if(files[i].substring(0,files[i].indexOf('_')) == fileName.substring(0,fileName.indexOf('_') ))
        {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring( files[i].indexOf('_')+1, files[i].indexOf("_",files[i].indexOf('_')+1) );
            if(Math.abs(this.currentForm.version)> Math.abs(ver))
            {
                // ok its an older version
                // delete it
                
                helper.alert("There is a version of this form in Publish folder. This version will be removed and form will be saved in prepublish folder.")
                fs.unlink(helper.join(helper.getPublishPath(), files[i]));
            }
            else
            {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Publish folder! Please save this form as a copy to disk and investigate.")
                return;
            }
            
        }
    }
    
    fs.writeFile(helper.join(helper.getPrepublishPath(), fileName), content, function (err) {
            if(err)
            {
                console.log("Saving failed. " + err.toString());
                success=false;
            }
            
        });
        if(success)
        {
            $("#" + dirtyMarkId).hide();
            index.closeTab(dirtyMarkId.replace("_dirty",""));
            
 }
    
}
this.publish = function(dirtyMarkId)
{
       var success=true;
    this.currentForm.version = Math.abs(this.currentForm.version)+1;
    var content = JSON.stringify(this.currentForm,SaveJSONReplacer,2);

    var p=helper.getPublishPath();
    var fileName = this.currentForm.id + "_" + this.currentForm.version + "_" + this.currentForm.name;
    //fileName = helper.ensureFileNameUnique(p,fileName);
    // check if exists in prebublished
  
    
   // check if exists in published
    files = helper.getFilesInDir(helper.getPublishPath());
    
    for(var i in files)
    {
        if(files[i].substring(0,files[i].indexOf('_')) == fileName.substring(0,fileName.indexOf('_') ))
        {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring( files[i].indexOf('_')+1, files[i].indexOf("_",files[i].indexOf('_')+1) );
            if(Math.abs(this.currentForm.version)> Math.abs(ver))
            {
                // ok its an older version
                // delete it
                
                fs.unlink(helper.join(helper.getPublishPath(), files[i]));
            }
            else
            {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Publish folder! Please save this form as a copy to disk and investigate.")
                return;
            }
            
        }
    }
      var files = helper.getFilesInDir(helper.getPrepublishPath());
    
    for(var i in files)
    {
        if(files[i].substring(0,files[i].indexOf('_')) == fileName.substring(0,fileName.indexOf('_') ))
        {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring( files[i].indexOf('_')+1, files[i].indexOf("_",files[i].indexOf('_')+1) );
            if(Math.abs(this.currentForm.version)> Math.abs(ver))
            {
                // ok its an older version
                // delete it
                 helper.alert("There is a version of this form in Prepublish folder. This version will be removed and form will be saved in Publish folder.")
                 fs.unlink(helper.join(helper.getPrepublishPath(), files[i]));
            }
            else
            {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Prepublish folder! Please save this form as a copy to disk and investigate.")
                return;
            }
            
        }
    }
    
    fs.writeFile(helper.join(helper.getPublishPath(), fileName), content, function (err) {
            if(err)
            {
                console.log("Saving failed. " + err.toString());
                success=false;
            }
            
        });
        if(success)
        {
            $("#" + dirtyMarkId).hide();
            index.closeTab(dirtyMarkId.replace("_dirty",""));
            
 }
    
}
