function getPropertyGrid(form) {
    console.log('#' + form.placeHolderPrefix + 'propGrid');
    return $('#' + form.placeHolderPrefix + 'propGrid')
}
function ctlBoxSelect(field, form) {
    getPropertyGrid(form).jqPropertyGrid(field, field._propsMeta);
    $("[id^='field_dcform_" + form.id + "']").css("border", "solid 1px transparent");
    $("[id^='field_dcform_" + form.id + "']").css("background-color", "");

    $('#field_' + field._lastCumulativeId).css("border", "dashed 1px red");
    $('#field_' + field._lastCumulativeId).css("background-color", "yellow");

}
function ctlBoxDelete(field, form) {
    getPropertyGrid(form).jqPropertyGrid(null, null);
    $("[id^='field_dcform_" + form.id + "']").css("border", "none");
    $("[id^='field_dcform_" + form.id + "']").css("background-color", "");

    $('#ctlbox_' + field._lastCumulativeId).html("");
    $('#field_' + field._lastCumulativeId).html("");
    //  field._parent.pop(field);
}
function ctlBoxExpandCollapse(span, field, form) {
 
    //   $("[id^='field_dcform_" +  form.id + "']").css("height:","");
 
    if ($('#field_' + field._lastCumulativeId).css("height") != "22px") {
        $('#field_' + field._lastCumulativeId).css("height", "22px");
        $('#field_' + field._lastCumulativeId).css("overflow", "hidden");
        $(span).addClass("ui-icon-plus");
        $(span).removeClass("ui-icon-minus");

    }
    else {
        $('#field_' + field._lastCumulativeId).css("height", "");
        $(span).removeClass("ui-icon-plus");
        $(span).addClass("ui-icon-minus");
    }

}