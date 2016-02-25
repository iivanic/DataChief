function getPropertyGrid(form)
{
    console.log('#' + form.placeHolderPrefix + 'propGrid');
    return  $('#' + form.placeHolderPrefix + 'propGrid')
}
function ctlBoxSelect(field, form)
{
    getPropertyGrid(form).jqPropertyGrid(field, field._propsMeta);
    $("[id^='field_dcform_" +  form.id + "']").css("border","none");
    $("[id^='field_dcform_" +  form.id + "']").css("background-color","");
    
    $('#field_' + field._lastCumulativeId ).css("border","dashed 1px red");
    $('#field_' + field._lastCumulativeId ).css("background-color","orange");
    
}