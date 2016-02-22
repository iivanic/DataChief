//types
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");
var listField = require("./listField.js");
var currentDateTimeField = require("./currentDateTimeField.js");
var currentUserField = require("./currentUserField.js");

var helper = require("./utils.js");

// fields

this._name = "New Form";
this._description = "Description";
this._footer = "Footer";
this._version = "1.0";
this._author = "user";
this._lastTimeTemplatechanged = new Date();
this._children = new Array();

// metadata for editing in jqPropertyGrid
this._propsMeta = {
    // Since string is the default no nees to specify type
    _name: { group: 'Form Settings', name: 'Name', description: 'Name of the form.', showHelp: true },
    _version: { group: 'Form Settings', name: 'Version', description: 'Form template version.', showHelp: true },
    _description: { group: 'Form Settings', name: 'Description', description: 'Description of the form.', showHelp: true },
    _footer: { group: 'Form Settings', name: 'Footer', description: 'Footer of the form.', showHelp: true },
    _author: { group: 'Ownership', name: 'Author', description: 'Who made this the form?', showHelp: true },
    _lastTimeTemplatechanged: { group: 'Ownership', name: 'Changed', type: 'label', description: 'Last time template structure changed.', showHelp: true },
    _children: { browsable: false },
    _propsMeta: { browsable: false }
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

this.render = function (placeholder, editable, user) {
    console.log("form.render()");
    var str = "<div><h1>" + this._name + " <small>v" + this._version + "</small></h1>";
    str += "<p>" + this.description + "</p>";
    for (var i in this._children) {
        str += this._children[i].render(placeholder, editable, user);
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
    this._footer = "This is an simple example DataChief Form.";
    this._version = "1.0"
    this._author = helper.getCurrentUsername();
    this._lastTimeTemplatechanged = new Date();

    var txt;

    var grp = Object.create(groupField);
    grp.ctor();
    grp.displayName = "Vehicle usage details";
    grp.toolTip = "Enter detailed infromation.";
    grp.description = "Provide detailed information regarding vehicle usage."
    this.children.push(grp);

    var lst = Object.create(listField);
    lst.ctor();
    lst.displayName = "Vehicle used";
    lst.options = "BMW 328i (Plate N#XX-XXXX);Ford F-150 (Plate N#XX-XXXX);Toyota Camry (Plate N#XX-XXXX);Nissan Leaf (Plate N#XX-XXXX);Nissan Leaf 2016 (Plate N#XX-XXXX)"
    lst.description = "Choose vehicle used"
    lst.toolTip = lst.description;
    lst.required = true;
    grp.children.push(lst);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Reason or Work order#";
    txt.description = "Why did you need this vehicle?";
    txt.toolTip = "Enter work order nuber, or describe what have you been doing with vehicle.";
    txt.multiline = true;
    txt.required = true;
    grp.children.push(txt);

    var grp1 = Object.create(groupField);
    grp1.ctor();
    grp1.displayName = "Mileage details";
    grp1.toolTip = "Enter mileage details here.";
    grp1.description = "Provide detailed information regarding vehicle mileage."
    grp.children.push(grp1);


    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Start date and time";
    txt.description = "";
    txt.toolTip = "";
    txt.required = true;
    grp1.children.push(txt);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Start odometer";
    txt.description = "";
    txt.toolTip = "";
    txt.required = true;
    grp1.children.push(txt);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "End date and time";
    txt.description = "";
    txt.toolTip = "";
    txt.required = true;
    grp1.children.push(txt);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "End odometer";
    txt.description = "";
    txt.toolTip = "";
    txt.required = true;
    grp1.children.push(txt);

    lst = Object.create(listField);
    lst.ctor();
    lst.displayName = "Choose special usage conditions (if any)";
    lst.description = "Choose all that apply";
    lst.toolTip = "Did you used this car in a way thet is considered heavy duty?";
    lst.options = "Towing;Off-road;Heavy load;Track racing or other prolonged heavy breaking situations";
    lst.multiselect = true
    grp.children.push(lst);

    lst = Object.create(listField);
    lst.ctor();
    lst.displayName = "Is vehicle in working order?";
    lst.toolTip = "Is vehicle in working order?";
    lst.description = "Car is not damaged and everything is in order?"
    lst.options = "Yes;No;Service is needed";
    lst.multiselect = false;
    lst.required = true;
    grp.children.push(lst);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Notes on vehicle state";
    txt.description = "Enter notes here if something is broken or damaged on the vehicle.";
    txt.toolTip = "What have you noticed, if anything, regarding vehicle state?";
    txt.multiline = true;
    txt.required = false;
    grp.children.push(txt);

    grp = Object.create(groupField);
    grp.ctor();
    grp.displayName = "Signature";
    grp.toolTip = "Your signature.";
    grp.description = ""
    this.children.push(grp);

    var cu = Object.create(currentDateTimeField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);
    cu = Object.create(currentUserField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);

    grp = Object.create(groupField);
    grp.ctor();
    grp.displayName = "Review";
    grp.toolTip = "Reviewer signature.";
    grp.description = ""
    this.children.push(grp);

    cu = Object.create(currentDateTimeField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);
    cu = Object.create(currentUserField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);

    lst = Object.create(listField);
    lst.ctor();
    lst.displayName = "Is this log correctly filled out?";
    lst.toolTip = "Revier needs to review this log?";
    lst.description = "Choose coclusion?"
    lst.options = "Yes;No;There is room for improvements";
    lst.multiselect = false;
    lst.required = true;
    grp.children.push(lst);

    txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Comment";
    txt.description = "Reviewer comment and recomendation.";
    txt.toolTip = "Optional reviewer comment and recomendation";
    txt.multiline = true;
    txt.required = false;
    grp.children.push(txt);

}
this.ctor = function () {
    this._children = new Array();
}
this.dispose = function () {

}