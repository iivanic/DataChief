// iherit from base class
this.__proto__ = require("./fieldBase.js");
this._multiselect = false;
this._options = "Yes;No";
this._type = "listField";

var helper = require("./utils.js");

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _defaultValue: { group: 'Field Settings', name: 'Default value', description: 'Defaut value for the field. Can bi list delimited with semicolon (;) if Multiselect is set.', showHelp: true },
    _multiselect: { group: 'Field Settings', name: 'Multiselect', description: 'Can multiple items be selected?', showHelp: true },
    _options: { group: 'Field Settings', name: 'Options', description: 'List of options to choose from delimited with semicolon (;)?', showHelp: true },
    _required: { group: 'Field Validation', name: 'Required', description: 'If selected, user must choose at least one options.', showHelp: true },
    _valueHasBeenSet: { browsable: false },
    _children: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    _type: { browsable: false },
    _requiredErrorMessage: { group: 'Field Validation', name: 'Required error message', description: 'Massege whe required field is missing.', showHelp: true }
}

Object.defineProperty(this, "multiselect", {
    get: function () {
        return this._multiselect;
    },
    set: function (val) {
        this._multiselect = val;
    }
});
Object.defineProperty(this, "options", {
    get: function () {
        return this._options;
    },
    set: function (val) {
        this._options = val;
    }
});

this.render = function (form, parent, placeholder, editable, user, idprefix) {
    //   console.log("listField.render()");
    this._form = form;
    this._parent = parent;
    this._lastCumulativeId = idprefix + "_" + this.id;
    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadFieldBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + idprefix + "_" + this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><label for='" + idprefix + "_" + this.id + "' title='" + this.toolTip + "'>" + this.displayName +
    (this.required ? "<span title='This field is Required' class='datachiefFieldRequired'>*</span>" : "") + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    ret += "<select data-validation-required-message='" + this._requiredErrorMessage + "' " + (this._required?"required":"" ) + " " + (this.multiselect ? "multiple" : "") + " id='" + idprefix + "_" + this.id + "' class='datachiefField datachiefFieldSelect'>";
    var options = this.options.split(';');
    var values = this.value.split(';');
    if (!this._multiselect) ret += "<option value=''><-- not selected --></option>";
    for (var i in options)
        ret += "<option " + ($.inArray(options[i], values) > -1 ? "selected" : "") + " value='" + options[i] + "'>" + options[i] + "</option>";

    ret += "</select>";
    ret += "<p class='help-block'></p></div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "listField";
    this._multiselect = false;
    this._defaultValue = "";
    this._form = null;
    this._parent = null;
    this._required = false;
    this._toolTip = "Tooltip";
    this._description = "Description";
    this._displayName = "Label";
    this._defaultValue = "";
    this._requiredErrorMessage = "This field is required.";
}
this.findField = function (idwithprefix) {
    //  console.log("listField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //      console.log("listField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}