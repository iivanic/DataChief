//types
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");

var helper = require("./utils.js");

// fields

this._name = "New Form";
this._description = "Description";
this._footer = "Footer";
this._version = "1.0";
this._author = "user";
this._lastTimeTemplatechanged= new Date();
this._children = new Array();

// metadata for editing in jqPropertyGrid
this._propsMeta = {
    // Since string is the default no nees to specify type
    _name: { group: 'Form Settings', name: 'Name', description: 'Name of the form.', showHelp: true},
    _version: { group: 'Form Settings', name: 'Version', description: 'Form template version.', showHelp: true},
    _description: { group: 'Form Settings', name: 'Description', description: 'Description of the form.', showHelp: true},
    _footer: { group: 'Form Settings', name: 'Footer', description: 'Footer of the form.', showHelp: true},
    _author: { group: 'Ownership', name: 'Author', description: 'Who made this the form?', showHelp: true},
    _lastTimeTemplatechanged: { group: 'Ownership', name: 'Changed',  type: 'label', description: 'Last time template structure changed.', showHelp: true},
    _children: { browsable: false},
    _propsMeta: { browsable: false}
}

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
Object.defineProperty(this, "footer", {
    get: function () {
        return this._footer;
    },
    set: function (val) {
        this._footer = val;
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
    str += "<hr />" + this._footer + "<div />";
    placeholder.html(str);
};

this.readValues = function () {
    console.log("form.readValue()");

};
this.createExampleForm = function (name, decription) {
    this._name = name;
    this._description = decription;
    this._footer = "Footer";
    this._version = "1.0"
    this._author = helper.getCurrentUsername();
    this._lastTimeTemplatechanged= new Date();

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