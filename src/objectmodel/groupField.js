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

this.render = function (placeholder) {
    console.log("groupField.render()");
    var ret = "";
    ret +="<fieldset><legend>" + this._displayName + "</legend>";
    for (var i in this._children) {
        ret += this._children[i].render(placeholder);
        ret += "<br />"
    }
    ret +="</fieldset>";
    return ret;

};
this.ctor = function () {
    this._children = new Array();
}