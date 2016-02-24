// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._type = "currentDateTimeField";



this.render = function (placeholder, editable, user, idprefix) {
    console.log("currentDateTimeField.render()");
    var ret = "<div class='datachiefFieldRow'><label for='" + idprefix + "_" +  this.id + "' title='" + this.toolTip + "'>" + this.displayName + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    ret += "<div  id='" + idprefix + "_" +  this.id + "' value='" + this.value + "' class='datachiefField'>";
    ret += this.value;
    ret += "</div>";
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
}