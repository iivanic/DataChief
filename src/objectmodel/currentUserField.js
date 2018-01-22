// iherit from base class
this.__proto__ = require("./fieldBase.js");
//var helper = require("./utils.js");

this._type = "currentUserField";
this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _required: { group: 'Field Validation', name: 'Required', description: 'Is this field required?', showHelp: true },
    _requiredErrorMessage: { group: 'Field Validation', name: 'Required error message', description: 'Massege whe required field is missing.', showHelp: true },
    _children: { browsable: false },
    _value: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    _type: { browsable: false }
}

this.render = function (form, parent, placeholder, editable, user, idprefix) {
    if(user=="initiator")
        user = userSettings.email;
    //  console.log("currentUserField.render()");
    var disabled = parent.disabled;
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
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><label for='" + idprefix + "_" + this.id + "' title='" + this.toolTip + "'>" + this.displayName + (this.required ? "<span title='This field is Required' class='datachiefFieldRequired'>*</span>" : "") + "</label>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    //   if (this._value == "" && !disabled) {
    ret += "<div class=row><div class='col-sm-6'>";
    ret += "<button  id='" + idprefix + "_" + this.id + "_button' type='button' style='width:100%;' class='btn btn-secondary'>" + (this._value == "" ? "Sign (" + helper.extractUser(user) + ")" : "Remove Signature") + "</button>";
    ret += "</div><div class='col-sm-6'>";
    //  }
    ret += "<input data-validation-required-message='" + this._requiredErrorMessage + "' " +
        (this._required ? "required" : "") + " readonly style='width:100%' type='text'  id='" + idprefix + "_" + this.id + "' class='datachiefField currentUserFieldMarker' value='" + this._value + "' />";
    // if (this._value == "" && !disabled) {
    ret += "<p class='help-block'></p></div></div>";
    // }
    ret += "</div>";
    return ret;
};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "currentUserField";
    this._id = "";
    this._value = "";
    this._toolTip = "Current user";
    this._description = "Who is filling out the form.";
    this._displayName = "Signature";
    this._required = true;
    this._requiredErrorMessage = "This field is required.";
    this._form = null;
    this._parent = null;
}
this.findField = function (idwithprefix) {
    //   console.log("currentUserField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //     console.log("currentUserField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}

