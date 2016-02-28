// iherit from base class
this.__proto__ = require("./fieldBase.js");
var helper = require("./utils.js");

this._type = "currentUserField";



this.render = function (form, parent, placeholder, editable, user, idprefix) {
    //  console.log("currentUserField.render()");
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
    ret += "<div  id='" + idprefix + "_" + this.id + "' class='datachiefField' value='" + this.value + "'>";
    ret += this.value;
    ret += "</div></div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "currentUserField";
    this._id = "";
    this._value = userSettings.email;
    this._toolTip = "Current user";
    this._description = "Who is filling out the form - probably You.";
    this._displayName = "Employee";
    this._defaultValue = "";
    this._valueHasBeenSet = false;
    this._required = true;
    this._form = null;
    this._parent = null;
}
this.findField = function (idwithprefix) {
    //   console.log("currentUserField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //     console.log("currentUserField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}

