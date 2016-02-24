// iherit from base class
this.__proto__ = require("./fieldBase.js");
this._multiline = false;
this._regexp = null;
this._maxlength = 1000;

Object.defineProperty(this, "multiline", {
    get: function () {
        return this._multiline;
    },
    set: function (val) {
        this._multiline = val;
    }
});
Object.defineProperty(this, "regexp", {
    get: function () {
        return this._regexp;
    },
    set: function (val) {
        this._regexp = val;
    }
});
Object.defineProperty(this, "maxlength", {
    get: function () {
        return this._maxlength;
    },
    set: function (val) {
        this._maxlength = val;
    }
});
this.render = function (placeholder, editable, user, idprefix) {
    console.log("textField.render()");
    var ret = "<div class='datachiefFieldRow'><label for='" +idprefix + "_" +  this.id + "' title='" + this.toolTip + "'>" + this.displayName + 
    (this.required?"<span title='This field is Required' class='datachiefFieldRequired'>*</span>":"") + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    if (this.multiline) {
        ret += "<textarea rows='4' maxlength='" + this.maxlength + " id='" + idprefix + "_" +  this.id + "' class='datachiefField datachiefFieldText'>"+ this.value + "</textarea>";
    }
    else {
        ret += "<input type='text' maxlength='" + this.maxlength + "' id='" + idprefix + "_" +  this.id + "' value='" + this.value + "' class='datachiefField datachiefFieldText'>";
        ret += "</input>";

    }
    ret += "</div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "textField";
    this._multiline = false;
    this._regexp = null;
    this._maxlength = 1000;

}