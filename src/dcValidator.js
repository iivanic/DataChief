this.ctor = function (region) {
    this.region = region;
    //required 
    $(region).find("[required]")
        .change(reqV)
        .keyup(reqV)
        .keydown(reqV)
        .focus(reqV)
        .blur(reqV)
        .prop("validator", this);
    $(region).find("[pattern]")
        .change(pattV)
        .keyup(pattV)
        .keydown(pattV)
        .focus(pattV)
        .blur(pattV)
        .prop("validator", this);
    this.isOK = true;
}
function reqV() {
    if ($(this).is(":disabled")) return;
    if (!$(this).val()) {
        $(this).next().text($(this).attr("data-validation-required-message")).show();
        $(this).prop("validator").isOK = false;
        return;
    }
    var elementType = $(this).prop('nodeName');
    console.log(elementType + ' ' + $(this).prop("multiple"));
    if (elementType == "SELECT")
        if ($(this).prop("multiple"))
            if ($(this).val().length == 0) {
                $(this).next().text($(this).attr("data-validation-required-message")).show();
                $(this).prop("validator").isOK = false;
                return;
            }
            else {
                $(this).next().hide();
                return;
            }

    if ($(this).val().trim() == "") {
        $(this).next().text($(this).attr("data-validation-required-message")).show();
        $(this).prop("validator").isOK = false;
    }
    else
        $(this).next().hide();
}
function pattV() {
    if ($(this).is(":disabled")) return;
    var regEx = new RegExp($(this).attr("pattern"), "gi");
    if ($(this).val().trim().length > 0) {
        var t = regEx.test($(this).val());

        if (!t) {
            $(this).next().text($(this).attr("data-validation-pattern-message")).show();
            $(this).prop("validator").isOK = false;
        }
        else
            $(this).next().hide();
    }
}
this.validate = function () {
    this.isOK = true;


    $(this.region).find("[required]")
        .trigger("change");
    $(this.region).find("[pattern]")
        .trigger("change");

    return this.isOK;
}