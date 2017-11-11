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

this.d = null;

this.openForm = function (jsonstring, loadedFrom) {

    var loadedObj = JSON.parse(jsonstring);

    console.log("Reconstructing objects from loaded JSON.");
    var cnt = 0;
    for (var attrname in loadedObj) {
        // console.log("attrname = " + attrname);

        if (attrname == "_children")
            loadChildren(this.currentForm, loadedObj[attrname], attrname);
        else
            this.currentForm[attrname] = loadedObj[attrname];
        cnt++;
    }
    if (loadedFrom)
        this.currentForm.filename = loadedFrom;
    // we need to change id to avoid conflicts if the same form is already oened in editor.
    //this.currentForm.regenerateGUID();
    console.log("Done reconstructing objects from loaded JSON.");
    return true;
}

function loadChildren(parent, obj, aname, sec) {
    console.log("loadChildren(" + parent + ", " + obj + ", " + aname + ")");

    var field;
    if (obj._type) {
        switch (obj["_type"]) {
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

        if (aname == "_children") {
            parent._children.push(field);
            console.log("added to _children");
        }
        if (aname == "_dataRows") {
            parent._dataRows[parent._dataRows.length - 1].push(field);
            console.log("added to _dataRows [" + parent._dataRows.length - 1 + "]");
        }
        if (aname == "_newRowTemplate") {
            parent._newRowTemplate.push(field);
            console.log("added to _newRowTemplate");
        }
        for (var arrayEl in obj) {

            if (arrayEl == "_children" || arrayEl == "_dataRows" || arrayEl == "_newRowTemplate") {
                loadChildren(field, obj[arrayEl], arrayEl, false);
            }
            else {
                field[arrayEl] = obj[arrayEl];
                console.log("copy " + arrayEl)
            }
        }
    }
    else {
        // its an array
        for (var arrayEl in obj) {

            if (aname == "_dataRows" && !sec) {
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
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}

this.newForm = function (name, placeHolder, tabCounter, dirtyMark, loadedObj) {

    this.dirtyMark = dirtyMark;
    this.tabTitle = "#Fillertabs a[href='#Fillertabs-" + tabCounter + "']";
    this.placeHolder = placeHolder;
    this.dirtyMark = dirtyMark;
    this.prefix = placeHolder.attr('id') + "_";
    var htmlTemplate = helper.loadTextFile("../templates/formdisplay.html");
    htmlTemplate = htmlTemplate.replace(/prefix_/gi, this.prefix);
    placeHolder.html(htmlTemplate);

    this.currentForm = Object.create(form);
    this.currentForm.ctor();

    var loadedFrom = loadedObj;

    loadedObj = helper.loadFile(loadedObj);

    this.openForm(loadedObj, loadedFrom);
    this.resetDirty();
    $(this.tabTitle).text(this.currentForm.name);


    // if form haspublished flag then user is inititator for sure
    // if user is in forms publishedTo List then he is initiator, TODO: should also check workflow step, if form returns to user on published to list then he is no longer initiator
    this.currentForm.render($("#" + this.prefix + "formPreview"),
        false
        // initiator can be only if no impersonation ... ???  ( userSettings.email == userSettings.identitySetting.email ? ", initiator": "" )
        , userSettings.identitySetting.email + (this.currentForm.published ||
            (helper.checkUser(userSettings.identitySetting.email, this.currentForm.publishedTo) && (this.currentForm.workflowStep == undefined || this.currentForm.workflowStep == 0))

            ? ", initiator" : ""), "dcformFiller");

    $("#Fillertabs-" + tabCounter).prop("current", this.currentForm);
    this.bindSaveButton();
}

this.applyFormChanges = function () {
    // in preview mode do nothing    
    var isEdit = $("#" + this.prefix + "editormode").val() == "edit" ? true : false;
    if (!isEdit)
        return;
    // In order to get back the modified values:
    var pgrid = $('#' + this.prefix + 'propGrid');
    var theNewObj = pgrid.jqPropertyGrid('get');
    //copy properties to form
    var isDirty = false
    // if _repeater has changes, set trtough theproperty, so swap can be triggered
    if (pgrid.prop("current")["_repeater"] != undefined)
        if (pgrid.prop("current")["_repeater"] != theNewObj["_repeater"]) {
            pgrid.prop("current").repeater = theNewObj["_repeater"];
            isDirty = true;
        }
    //copy objects
    for (var attrname in theNewObj) {
        if (pgrid.prop("current")[attrname] != theNewObj[attrname])
            isDirty = true;
        pgrid.prop("current")[attrname] = theNewObj[attrname];
    }
    if (isDirty)
        this.setDirty();

    $(this.tabTitle).text(this.currentForm.name);
    this.currentForm.refresh();
    markSelected(this.currentForm);
    if (isDirty)
        this.setDirty();

    this.setImpersonationList();

}

this.saveJSONReplacer = SaveJSONReplacer;

function SaveJSONReplacer(key, value) {
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
    if (key == "_form") return undefined;
    else if (key == "_parent") return undefined;
    else if (key == "_lastCumulativeId") return undefined;
    else if (key == "_handleRenderStyleCounter") return undefined;
    else if (key == "_maxHandleRenderStyleCounter") return undefined;
    else if (key == "_allUsersForImpersonation") return undefined;
    else if (key == "validator") return undefined;
    else if (key == "_lastPlaceholder") return undefined;
    else if (key == "placeHolderPrefix") return undefined;
    else if (key == "idprefix") return undefined;
    else if (key == "_lastEditable") return undefined;
    else if (key == "_lastUser") return undefined;
    else return value;
}

this.saveForm = function (dirtyMarkId, folder) {
    this.currentForm.readValues();
    var success = true;
    var content = JSON.stringify(this.currentForm, SaveJSONReplacer, 2);
    if (!folder) {
        dialog.showSaveDialog(
            {
                title: "Save " + this.currentForm.name,
                defaultPath: this.currentForm.name,
                filters: [
                    { name: 'DataChief Form', extensions: ['DataChiefForm'] },
                    { name: 'All files', extensions: ['*'] },
                ]
            },
            function (fileName) {
                if (fileName === undefined) return;
                fs.writeFile(fileName, content, function (err) {
                    if (err) {
                        console.log("Saving failed. " + err.toString());
                        success = false;
                    }

                });
                if (success)
                    $("#" + dirtyMarkId).hide();

            });
    }
    else {

        if (folder === undefined) return;
        fs.writeFile(folder, content, function (err) {
            if (err) {
                console.log("Saving failed. " + err.toString());
                success = false;
            }

        });
        if (success) {
            $("#" + dirtyMarkId).hide();
            filler.refreshFolders();

        }
    }

}
this.resetDirty = function () {
    this.dirtyMark.hide();
}
this.setDirty = function () {
    this.dirtyMark.show();
}

this.bindSaveButton = function () {
    $("#" + this.prefix + "selectFillerSave").button({
        text: true,
        icons: {
            secondary: "ui-icon-triangle-1-s"
        }
    })
        .click(function () {
            var menu = $(this).parent().next().show().position({
                my: "left top",
                at: "left bottom",
                of: this
            });
            $(document).one("click", function () {
                menu.hide();
            });
            return false;
        })
        .parent()
        .buttonset()
        .next()
        .hide()
        .menu();


    $("#" + this.prefix + "selectFiller_submit").prop("me", this);
    $("#" + this.prefix + "selectFiller_submit")
        //  .button()
        .click(function () {
            this.me.submit(this.me.dirtyMark.attr('id'));
        });

    $("#" + this.prefix + "selectFiller_saveToWork").prop("me", this);
    $("#" + this.prefix + "selectFiller_saveToWork")
        //  .button()
        .click(function () {
            this.me.saveToWork(this.me.dirtyMark.attr('id'));
        });
    $("#" + this.prefix + "selectFiller_fillerDelete").prop("me", this);
    $("#" + this.prefix + "selectFiller_fillerDelete")
        //  .button()
        .click(function () {
            this.me.fillerDeleteForm(this.me.dirtyMark.attr('id'));
        });
    //enable send back form if enabled for form
    if (this.currentForm.allowSendOneStepBack && this.currentForm.workflowStep) {
        $("#" + this.prefix + "selectFiller_sendFormOneStepBack").prop("me", this);
        $("#" + this.prefix + "selectFiller_sendFormOneStepBack")
            //  .button()
            .click(function () {
                this.me.sendFormOneStepBack(this.me.dirtyMark.attr('id'));
            });
    }
    else
        $("#" + this.prefix + "selectFiller_sendFormOneStepBack").css("display", "none");

};
this.sendFormOneStepBack = function (dirtyMarkId) {

    this.currentForm.workflowStep = this.currentForm.workflowStep - 2;
    this.submit(dirtyMarkId);
}
this.submit = function (dirtyMarkId) {

    if (this.currentForm.validator.validate()) {
        this.d = new Date();
        var myoutbox = helper.getMyOutboxPath();

        // 
        this.currentForm.workflowpackage = true;
        // set workflow step.
        if (!this.currentForm.workflowStep)
            this.currentForm.workflowStep = 1;
        else
            this.currentForm.workflowStep++;

        //  read values & save to outbox
        var filename = this.fixForm(myoutbox); //helper.join(helper.getMyOutboxPath(), helper.getOnlyFileName(this.currentForm.filename));

        this.saveForm(
            dirtyMarkId,
            filename
        );
        //delete old file if came from other user (not published)
        //   if( this.currentForm.workflowStep>0) 
        //       helper.deleteFile(this.currentForm.filename);

        $("#" + dirtyMarkId).hide();
        filler.removeTab(this.dirtyMark);
        filler.refreshFolders();
    }
    else
        helper.alert("Form not properly filled out!");
}

this.saveToWork = function (dirtyMarkId) {
    this.d = new Date();
    if (this.currentForm.published) {
        this.currentForm.createdByMe = true;
    }
    this.fixForm(helper.getWorkPath());

    this.saveForm(
        dirtyMarkId,
        this.currentForm.filename
    );
    filler.removeTab(this.dirtyMark);

}
this.fixForm = function (path) {
    if (this.currentForm.published) {
        // when saving form that was created from templatet, we need to give it an intance id
        this.currentForm.formid = helper.generateGUID();
    }

    var filename = helper.join(
        path, this.currentForm.formid + "_" + this.currentForm.name + " " +
        helper.formatDateForFileName(this.d)
    );

    var fname = this.currentForm.filename;
    // time is in the name, delete old file if exists - but not if it is in "published to me" folder
    if (fname && this.currentForm.workflowStep > 1) {
        if (helper.fileExists(fname)) {
            helper.deleteFile(fname);
        }
    }
    this.currentForm.filename = filename;
    if (this.currentForm.published) {
        this.currentForm.published = false;
        this.currentForm.createdByMe = true;
        this.currentForm.initiator = userSettings.identitySetting.email;
        this.currentForm.initiationDate = new Date();
        this.currentForm.filename = filename;
    }
    return filename;
}
this.fillerDeleteForm = function () {
    var al = false;
    if (this.currentForm.published || this.currentForm.createdByMe) {
        // is it saved to disk? 
        var f = $("#" + this.dirtyMark.attr("id").replace("_dirty", "")).prop("current");
        if (f)
            if (f.filename) {
                if (f.filename.startsWith(helper.getWorkPath())) {
                    helper.deleteFile(f.filename);
                    filler.refreshFolders();
                }
            }

        //close its tab
        filler.removeTab(this.dirtyMark);
    }
    else
        al = true;
    if (al)
        helper.alert("Form(s) recieved from other user(s) can not be deleted.");
}


this.prepublish = function (dirtyMarkId) {
    var success = true;
    var content = JSON.stringify(this.currentForm, SaveJSONReplacer, 2);

    var p = helper.getPrepublishPath();
    this.currentForm.version = Math.abs(this.currentForm.version) + 1;
    var fileName = this.currentForm.id + "_" + this.currentForm.version + "_" + this.currentForm.name;
    //fileName = helper.ensureFileNameUnique(p,fileName);
    // check if exists in prebublished
    var files = helper.getFilesInDir(helper.getPrepublishPath());

    for (var i in files) {
        if (files[i].substring(0, files[i].indexOf('_')) == fileName.substring(0, fileName.indexOf('_'))) {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring(files[i].indexOf('_') + 1, files[i].indexOf("_", files[i].indexOf('_') + 1));
            if (Math.abs(this.currentForm.version) > Math.abs(ver)) {
                // ok its an older version
                // delete it
                fs.unlink(helper.join(helper.getPrepublishPath(), files[i]));
            }
            else {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Prepublish folder! Please save this form as a copy to disk and investigate.")
                return;
            }

        }
    }

    // check if exists in published
    files = helper.getFilesInDir(helper.getPublishPath());

    for (var i in files) {
        if (files[i].substring(0, files[i].indexOf('_')) == fileName.substring(0, fileName.indexOf('_'))) {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring(files[i].indexOf('_') + 1, files[i].indexOf("_", files[i].indexOf('_') + 1));
            if (Math.abs(this.currentForm.version) > Math.abs(ver)) {
                // ok its an older version
                // delete it

                helper.alert("There is a version of this form in Publish folder. This version will be removed and form will be saved in prepublish folder.")
                fs.unlink(helper.join(helper.getPublishPath(), files[i]));
            }
            else {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Publish folder! Please save this form as a copy to disk and investigate.")
                return;
            }

        }
    }

    fs.writeFile(helper.join(helper.getPrepublishPath(), fileName), content, function (err) {
        if (err) {
            console.log("Saving failed. " + err.toString());
            success = false;
        }

    });
    if (success) {
        $("#" + dirtyMarkId).hide();
        index.closeTab(dirtyMarkId.replace("_dirty", ""));

    }

}
this.publish = function (dirtyMarkId) {
    var success = true;
    var content = JSON.stringify(this.currentForm, SaveJSONReplacer, 2);

    var p = helper.getPublishPath();
    this.currentForm.version = Math.abs(this.currentForm.version) + 1;
    var fileName = this.currentForm.id + "_" + this.currentForm.version + "_" + this.currentForm.name;
    //fileName = helper.ensureFileNameUnique(p,fileName);
    // check if exists in prebublished


    // check if exists in published
    files = helper.getFilesInDir(helper.getPublishPath());

    for (var i in files) {
        if (files[i].substring(0, files[i].indexOf('_')) == fileName.substring(0, fileName.indexOf('_'))) {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring(files[i].indexOf('_') + 1, files[i].indexOf("_", files[i].indexOf('_') + 1));
            if (Math.abs(this.currentForm.version) > Math.abs(ver)) {
                // ok its an older version
                // delete it

                fs.unlink(helper.join(helper.getPublishPath(), files[i]));
            }
            else {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Publish folder! Please save this form as a copy to disk and investigate.")
                return;
            }

        }
    }
    var files = helper.getFilesInDir(helper.getPrepublishPath());

    for (var i in files) {
        if (files[i].substring(0, files[i].indexOf('_')) == fileName.substring(0, fileName.indexOf('_'))) {
            // there is this file in prepublished
            // is it older v?
            var ver = files[i].substring(files[i].indexOf('_') + 1, files[i].indexOf("_", files[i].indexOf('_') + 1));
            if (Math.abs(this.currentForm.version) > Math.abs(ver)) {
                // ok its an older version
                // delete it
                helper.alert("There is a version of this form in Prepublish folder. This version will be removed and form will be saved in Publish folder.")
                fs.unlink(helper.join(helper.getPrepublishPath(), files[i]));
            }
            else {
                //ups! Its an newer version.
                helper.alert("There is a newer version of this form in Prepublish folder! Please save this form as a copy to disk and investigate.")
                return;
            }

        }
    }

    fs.writeFile(helper.join(helper.getPublishPath(), fileName), content, function (err) {
        if (err) {
            console.log("Saving failed. " + err.toString());
            success = false;
        }

    });
    if (success) {
        $("#" + dirtyMarkId).hide();
        index.closeTab(dirtyMarkId.replace("_dirty", ""));

    }

}