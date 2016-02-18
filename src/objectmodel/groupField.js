// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._fileds = new Array();

//properties
Object.defineProperty(this, "fields", {
    get: function () {
        return this._fields;
    },
    set: function (val) {
        this._fields = val;
    }
});