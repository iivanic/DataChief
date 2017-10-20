// iherit from base class
this.__proto__ = require("./fieldBase.js");
this._multiline = false;
this._regexp = "";
this._regexpErrorMessage = "";
this._maxlength = 1000;
//var helper = require("./utils.js");

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _min: { group: 'Field Settings', name: 'Minimum value', description: 'Specifies the minimum value for an input field.', showHelp: true },
    _max: { group: 'Field Settings', name: 'Maximum value', description: 'Specifies the maximum value for an input field.', showHelp: true },
    _step: { group: 'Field Settings', name: 'Number of intervals', description: 'Specifies the legal number intervals for an input field.', showHelp: true },
    _required: { group: 'Field Validation', name: 'Required', description: 'Is this field required?', showHelp: true },
    _multiline: { group: 'Field Settings', name: 'Multiline', description: 'Enable one or multiple lines for text. Must be Off for input types other than text.', showHelp: true },
    _maxlength: { group: 'Field Settings', name: 'Max length', description: 'Maximal langth of text.', showHelp: true },
    _regexp: { group: 'Field Validation', name: 'Regular Expression', description: 'Regular expression.', showHelp: true },
    _regexp_predefined: {  browsable: false ,group: 'Field Validation', name: 'Predefined Regular Expression', 
     type: 'options', options: [{ text: 'Positive integer', value: '0' }, { text: 'Positive or negative integer', value: '1' }, { text: 'Three columns', value: '2' }], description: 'Regular expression.', showHelp: true },
    _regexpErrorMessage: { group: 'Field Validation', name: 'Regular Expression Error message', description: 'Message when regular expression is not met.', showHelp: true },
    _requiredErrorMessage: { group: 'Field Validation', name: 'Required error message', description: 'Massege whe required field is missing.', showHelp: true },
    _inputType:{ group: 'Field Settings', name: 'Data Type', description: 'Data type of value.', showHelp: true,
                    type: 'options', options: [
                        { text: 'Text - for use of Reg. Exp.', value: 'text' },
                        { text: 'Color - multiline must be off', value: 'color' },
                        { text: 'Date - multiline must be off', value: 'date' },
                        { text: 'DateTime - multil. must be off', value: 'datetime-local' },
                        { text: 'Email - multiline must be off', value: 'email' },
                        { text: 'Month - multiline must be off', value: 'month' },
                        { text: 'Number - multiline must be off', value: 'number' },
                        { text: 'Range - multiline must be off', value: 'range' },
                        { text: 'Time - multiline must be off', value: 'time' },
                        { text: 'Url - multiline must be off', value: 'url' },
                        { text: 'Week - multiline must be off', value: 'week' }
                        ]},
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
        ret += "<textarea  id='" + idprefix + "_" + this.id + "' data-validation-required-message='" + this._requiredErrorMessage + "'  " + (this._required?"required":"" ) + " " + (this._regexp.length>0?"pattern='" + this._regexp +"' data-validation-pattern-message='" + this._regexpErrorMessage +"'" :"" ) + " rows='4' maxlength='" + this.maxlength + " id='" + idprefix + "_" + this.id + "' class='datachiefField datachiefFieldText'>" + this.value + "</textarea>";
    }
    else {
        ret += "<input data-validation-required-message='" + this._requiredErrorMessage + "' " + 
            (this._required?"required":"" ) + " " +
            (this._max.length?"max='" + this._max +"' ":"") +
            (this._min.length?"min='" + this._min +"' ":"") +
            (this._step.length?"step='" + this._step +"' ":"") +
            (this._regexp.length>0?"pattern='" + this._regexp +"' data-validation-pattern-message='" + this._regexpErrorMessage +"'" :"" )  + " " 
              + " type='" + this._inputType + "' maxlength='" + this.maxlength + "' id='" + idprefix + "_" + this.id + "' value='" + this.value + "' class='datachiefField datachiefFieldText'>";
        ret += "</input>";

    }
    ret += "<p class='help-block'></p></div>";
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
    this._displayName = "Label for text field";
    this._regexpErrorMessage = "Incorrect format.";
    this._requiredErrorMessage = "This field is required.";
    this._regexp_predefined = "";
    this._inputType="text";
    this._min="";
    this._max="";
    this._step="";
}
this.findField = function (idwithprefix) {
    //    console.log("textField.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //       console.log("textField.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}