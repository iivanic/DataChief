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

this.render = function (placeholder, editable, user) {
    console.log("groupField.render()");
    var ret = "";
    ret +="<div class='datachiefFieldRow'><fieldset class='datachiefField'><legend title='" + this.toolTip + "'>" + this.displayName + "</legend>";
    ret +="<p title='" + this.toolTip + "'>" + this.description + "</p>";
    for (var i in this._children) {
        ret += this._children[i].render(placeholder);
        ret += "<br />"
    }
    ret +="</fieldset></div>";
    return ret;

};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type="groupField";

}