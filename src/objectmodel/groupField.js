// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._children = new Array();

//properties
Object.defineProperty(this, "children", {
    get: function () {
        return this._children;
    },
    set: function (val) {
        this._children = val;
    }
});

this.render = function (placeholder, editable, user, idprefix) {
    console.log("groupField.render()");
    var ret = "";
    ret += "<div id='selectable_" + idprefix + "_" +  this.id + "' class='datachiefFieldRow'><fieldset class='datachiefField'><legend title='" + this.toolTip + "'>" + this.displayName + "</legend>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    if (editable)
        ret += "<ul id='sortable_" + idprefix + "_" +  this.id + "'>";
    for (var i in this._children) {
        ret += this._children[i].render(placeholder, editable, user, idprefix + "_" + this.id);
        ret += "<br />"
    }
    if (editable)
        ret += "</ul>"
    ret += "</fieldset></div>";

    return ret;

};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "groupField";

}