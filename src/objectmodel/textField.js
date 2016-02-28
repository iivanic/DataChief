// iherit from base class
this.__proto__ = require("./fieldBase.js");
this._multiline = false;
this._regexp = "";
this._maxlength = 1000;
var helper = require("./utils.js");

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _defaultValue: { group: 'Field Settings', name: 'Default value', description: 'Defaut value for the field.', showHelp: true },
    _required: { group: 'Field Settings', name: 'Required', description: 'Is this field required?', showHelp: true },
    _multiline: { group: 'Text', name: 'Multiline', description: 'Enable one or multiple lines for text.', showHelp: true },
    _maxlength: { group: 'Text', name: 'Max length', description: 'Maximal langth of text.', showHelp: true },
    _regexp: { group: 'Text', name: 'Regular Expression', description: 'Regular expression.', showHelp: true },
    _valueHasBeenSet: { browsable: false },
    _children: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    _type: { browsable: false }
}

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
this.render = function (form, parent, placeholder, editable, user, idprefix) {
  //  console.log("textField.render()");
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
    if (this.multiline) {
        ret += "<textarea rows='4' maxlength='" + this.maxlength + " id='" + idprefix + "_" + this.id + "' class='datachiefField datachiefFieldText'>" + this.value + "</textarea>";
    }
    else {
        ret += "<input type='text' maxlength='" + this.maxlength + "' id='" + idprefix + "_" + this.id + "' value='" + this.value + "' class='datachiefField datachiefFieldText'>";
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
    this._regexp = "";
    this._maxlength = 1000;
    this._form = null;
    this._parent = null;
    this._required = false;
    this._toolTip = "Tooltip";
    this._description = "Description";
    this._displayName = "Label";
    this._defaultValue = "";
}
this.findField = function (idwithprefix) {
    //    console.log("textField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //       console.log("textField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}