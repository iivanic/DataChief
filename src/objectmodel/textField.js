// iherit from base class
this.__proto__ = require("./fieldBase.js");

this.render = function (placeholder) {
    console.log("textField.render()");
    var ret = "";
    ret += "<textarea>";
    ret += "</textarea>";
    return ret;
};