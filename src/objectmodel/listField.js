// iherit from base class
this.__proto__ = require("./fieldBase.js");
this._multiselect = false;
this._options = "Yes;No";
this._maxlength = 1000;
this._type = "listField";

Object.defineProperty(this, "multiselect", {
    get: function () {
        return this._multiselect;
    },
    set: function (val) {
        this._multiselect = val;
    }
});
Object.defineProperty(this, "options", {
    get: function () {
        return this._options;
    },
    set: function (val) {
        this._options = val;
    }
});

this.render = function (placeholder, editable, user, idprefix) {
    console.log("listField.render()");
    var ret = "<div class='datachiefFieldRow'><label for='" + idprefix + "_" +  this.id + "' title='" + this.toolTip + "'>" + this.displayName + 
    (this.required?"<span title='This field is Required' class='datachiefFieldRequired'>*</span>":"") +"</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    ret += "<select " + (this.multiselect ? "multiple" : "") + " id='" + idprefix + "_" +  this.id + "' class='datachiefField datachiefFieldSelect'>";
    var options = this.options.split(';');
    var values = this.value.split(';');
    if(!this._multiselect) ret += "<option value=''><-- not selected --></option>";
    for (var i in options)
        ret += "<option " + ($.inArray(options[i], values) > -1?"selected":"") + " value='" + options[i] + "'>" + options[i] + "</option>";

    ret += "</select>";



    ret += "</div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "listField";
    this._multiselect = false;
    this._regexp = null;
    this._maxlength = 1000;

}