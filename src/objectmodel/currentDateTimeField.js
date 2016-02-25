// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._type = "currentDateTimeField";

var helper = require("./utils.js");


this.render = function (form, parent, placeholder, editable, user, idprefix) {
    //   console.log("currentDateTimeField.render()");
    this._form = form;
    this._parent = parent;
    this._lastCumulativeId = idprefix + "_" + this.id;
    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadFieldBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + idprefix + "_" + this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><label for='" + idprefix + "_" + this.id + "' title='" + this.toolTip + "'>" + this.displayName + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    ret += "<div  id='" + idprefix + "_" + this.id + "' value='" + this.value + "' class='datachiefField'>";
    ret += this.value;
    ret += "</div></div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "currentDateTimeField";
    this._id = "";
    this._value = new Date()
    this._toolTip = "Current time";
    this._description = "When is this form filled out - now.";
    this._displayName = "Timestamp";
    this._defaultValue = "";
    this._valueHasBeenSet = false;
    this._required = true;
    this._form = null;
    this._parent = null;
}
this.findField = function (idwithprefix) {
    //   console.log("currentDateTimeField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //      console.log("currentDateTimeField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}