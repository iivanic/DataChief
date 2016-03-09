function getPropertyGrid(form) {
    // console.log('#' + form.placeHolderPrefix + 'propGrid');
    return $('#' + form.placeHolderPrefix + 'propGrid')
}
function ctlBoxSelect(field, form) {
    getPropertyGrid(form).jqPropertyGrid(field, field._propsMeta);
    getPropertyGrid(form).prop("current", field);

    $("[id^='field_dcform_" + form.id + "']").removeClass("datachiefFieldRowSelected");
    $('#field_' + field._lastCumulativeId).addClass("datachiefFieldRowSelected");
}
function markSelected(form) {
    $("[id^='field_dcform_" + form.id + "']").removeClass("datachiefFieldRowSelected");
    var field = getPropertyGrid(form).prop("current");

    if (field) {
        $('#field_' + field._lastCumulativeId).addClass("datachiefFieldRowSelected");
    }
}
var tmpDeleteForm;
var tmpDeleteField;
function ctlBoxDelete(field, form) {
    tmpDeleteForm = form;
    tmpDeleteField = field;
    $("#dialog-confirm-remove-field").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete Field": function () {
                ctlBoxDeletePart2(tmpDeleteField, tmpDeleteForm);
                $(this).dialog("close")
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });



}
function ctlBoxDeletePart2(field, form) {
    getPropertyGrid(form).jqPropertyGrid(new Object(), null);
    getPropertyGrid(form).prop("current", null);

    if (!field._repeater) {
        field._parent._children = field._parent._children.filter(function (element, i) {
            return element.id !== field.id;
        });
    } else {

        field._parent._children._newRowTemplate = field._parent._children._newRowTemplate.filter(function (element, i) {
            return element.id !== field.id;
        });
    }
    form.refresh();
    markSelected(form)

}

function ctlBoxRefresh(field, form) {

    form.refresh();
    markSelected(form)
}
var tmpFieldToFind;
var tmpFieldToFindIndex;
var tmpFoundInTemplate;
function ctlBoxUp(field, form) {
    console.log("ctlBoxUp");
    ctlBoxSelect(field, form);
    tmpFieldToFind = field;
    tmpFieldToFindIndex = 0;
    tmpFoundInTemplate = false;
    field._parent._children.find(finder);
    if (tmpFieldToFindIndex > 0)
        tmpFoundInTemplate = false;
    else {
        field._parent._newRowTemplate.find(finder);
        if (tmpFieldToFindIndex > 0)
            tmpFoundInTemplate = true;

    }
    console.log("field is " + tmpFieldToFindIndex + ". in parent container.");
    if (tmpFieldToFindIndex > 0) {
        //move it up
        if (tmpFoundInTemplate)
            field._parent._newRowTemplate = MoveElementInArray(field._parent._newRowTemplate, tmpFieldToFindIndex, tmpFieldToFindIndex - 1);
        else
            field._parent._children = MoveElementInArray(field._parent._children, tmpFieldToFindIndex, tmpFieldToFindIndex - 1);
    }

    form.refresh();
    markSelected(form)
}
function ctlBoxDown(field, form) {
    console.log("ctlBoxDown");
    ctlBoxSelect(field, form);
    tmpFieldToFind = field;
    tmpFieldToFindIndex = 0;
    tmpFoundInTemplate = false;
    field._parent._children.find(finder);
    if (tmpFieldToFindIndex > 0)
        tmpFoundInTemplate = false;
    else {
        field._parent._newRowTemplate.find(finder);
        if (tmpFieldToFindIndex > 0)
            tmpFoundInTemplate = true;

    }
    console.log("field is " + tmpFieldToFindIndex + ". in parent container.");
    //move it down
    if (tmpFoundInTemplate) {
        if (tmpFieldToFindIndex < field._parent._newRowTemplate.length - 1) {
            field._parent._newRowTemplate = MoveElementInArray(field._parent._newRowTemplate, tmpFieldToFindIndex, tmpFieldToFindIndex + 1);
        }
    } else
        if (tmpFieldToFindIndex < field._parent._children.length - 1) {
            field._parent._children = MoveElementInArray(field._parent._children, tmpFieldToFindIndex, tmpFieldToFindIndex + 1);
        }

    form.refresh();
    markSelected(form)
}
function finder(field, index) {
    if (field.id == tmpFieldToFind.id) {
        tmpFieldToFindIndex = index;
        return true;
    }
}
function MoveElementInArray(array, old_index, new_index) {
    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array;
};


var groupField = require("./objectmodel/groupField.js");
var textField = require("./objectmodel/textField.js");
var fieldBase = require("./objectmodel/fieldBase.js");
var listField = require("./objectmodel/listField.js");
var currentDateTimeField = require("./objectmodel/currentDateTimeField.js");
var currentUserField = require("./objectmodel/currentUserField.js");

function ctlBoxAdd(field, form, fieldType) {
    console.log("Add " + fieldType);
    var newField = null
    switch (fieldType) {
        case "listField":
            newField = Object.create(listField);
            newField.ctor();
            break;
        case "textField":
            newField = Object.create(textField);
            newField.ctor();
            break;
        case "fieldBase":
            newField = Object.create(fieldBase);
            newField.ctor();
            break;
        case "groupField":
            newField = Object.create(groupField);
            newField.ctor();
            break;
        case "currentDateTimeField":
            newField = Object.create(currentDateTimeField);
            newField.ctor();
            break;
        case "currentUserField":
            newField = Object.create(currentUserField);
            newField.ctor();
            break;

    }
    if (newField) {

        console.log("Adding child of " + field.displayName + "..." + field._type)
        if (!field._repeater) {
            field.children.push(newField);
        }
        else {
            field._newRowTemplate.push(newField);
        }

        newField._form = form;
        newField._parent = field;
        newField._lastCumulativeId = "";

        getPropertyGrid(form).jqPropertyGrid(newField, newField._propsMeta);
        getPropertyGrid(form).prop("current", newField);
        form.refresh();
        markSelected(form)
    }
}


 
