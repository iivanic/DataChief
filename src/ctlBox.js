function getPropertyGrid(form) {
    console.log('#' + form.placeHolderPrefix + 'propGrid');
    return $('#' + form.placeHolderPrefix + 'propGrid')
}
function ctlBoxSelect(field, form) {
    getPropertyGrid(form).jqPropertyGrid(field, field._propsMeta);
    getPropertyGrid(form).prop("current", field);
    /*   $("[id^='field_dcform5_" + form.id + "']").css("border", "solid 1px transparent");
       $("[id^='field_dcform_" + form.id + "']").css("background-color", "");
   
       $('#field_' + field._lastCumulativeId).css("border", "dashed 1px red");
       $('#field_' + field._lastCumulativeId).css("background-color", "yellow");
   */
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
    /*  $("[id^='field_dcform_" + form.id + "']").css("border", "none");
    $("[id^='field_dcform_" + form.id + "']").css("background-color", "");
 
    $('#ctlbox_' + field._lastCumulativeId).html("");
    $('#field_' + field._lastCumulativeId).html("");
    */
    field._parent._children = field._parent._children.filter(function (element, i) {
        return element.id !== field.id;
    });
    form.refresh();
    markSelected(form)

}

function ctlBoxRefresh(field, form) {
    //   getPropertyGrid(form).jqPropertyGrid(new Object(), null);
    //    getPropertyGrid(form).prop("current", null);
    form.refresh();
    markSelected(form)
}
var tmpFieldToFind;
var tmpFieldToFindIndex;
function ctlBoxUp(field, form) {
    console.log("ctlBoxUp");
    ctlBoxSelect(field, form);
    tmpFieldToFind = field;
    tmpFieldToFindIndex = 0;
    field._parent._children.find(finder);
    console.log("field is " + tmpFieldToFindIndex + ". in parent container.");
    if (tmpFieldToFindIndex > 0) {
        //move it up
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
    field._parent._children.find(finder);
    console.log("field is " + tmpFieldToFindIndex + ". in parent container.");
    if (tmpFieldToFindIndex < field._parent._children.length - 1) {
        //move it down
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
    return array; // for testing purposes
};


 
