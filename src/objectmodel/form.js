//types
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");

var helper = require("./utils.js");

// fields

this._name = "New Form";
this._description = "Description";
this._version = "1.0"
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
Object.defineProperty(this, "name", {
    get: function () {
        return this._name;
    },
    set: function (val) {
        this._name = val;
    }
});
Object.defineProperty(this, "description", {
    get: function () {
        return this._description;
    },
    set: function (val) {
        this._description = val;
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

this.render = function (placeholder) {
    console.log("form.render()");
    var str = "<div><h1>" + this._name + " v" + this._version + "</h1>";
    str += "<p>" + this.description + "</p>";
    for (var i in this._children) {
        str += this._children[i].render(placeholder);
    }
    str += "<hr />footer<div />";
    placeholder.html(str);
};

this.readValues = function () {
    console.log("form.readValue()");

};
this.createExampleForm = function (name, decription) {
    this._name = name;
    this._description = decription;

    var txt = Object.create(textField);
    txt.ctor();
    this.children.push(txt);

    var grp = Object.create(groupField);
    grp.ctor();
    this.children.push(grp);

    txt = Object.create(textField);
    txt.ctor();
    grp.children.push(txt);

    txt = Object.create(textField);
    txt.ctor();
    grp.children.push(txt);
}
this.ctor = function () {
    this._children = new Array();
}
this.dispose = function () {

}