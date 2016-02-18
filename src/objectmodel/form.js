// iherit from base class
this.__proto__ = require("./groupField.js");

var helper = require("./utils.js");

// fields

this._name = "New Form";
this._version = "1"

Object.defineProperty(this, "name", {
    get: function () {
        return this._name;
    },
    set: function (val) {
        this._name = val;
    }
});
Object.defineProperty(this, "version", {
    get: function () {
        return this._version;
    },
    set: function (val) {
        this._version = val;
    }
});

//methods
this.render = function () {
    console.log("form.render()");
};
this.readValue = function () {
   console.log("form.readValue()");

};
this.createExampleForm()
{
    this._name="Example Form";
    
}