// ------------------------------------
// base class for all field types...
// ------------------------------------


//var helper = require("./utils.js");

//fields
this._id = "";
this._value = "";
this._toolTip = "Tooltip";
this._description = "Description";
this._displayName = "Name";
this._defaultValue = "";
this._valueHasBeenSet = false;
this._required = false;
this._type = "fieldBase";
this._lastCumulativeId = "";
this._form = null;
this._parent = null;

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _defaultValue: { group: 'Field Settings', name: 'Default value', description: 'Defaut value for the field.', showHelp: true },
    _required: { group: 'Field Settings', name: 'Required', description: 'Is this field required?', showHelp: true },
    _valueHasBeenSet: { browsable: false },
    _children: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    _type: { browsable: false }
}


//properties
Object.defineProperty(this, "id", {
    get: function () {
        if (this._id == "") {
            this._id = helper.generateGUID();
            //            console.log("ID GENERATED!");
        }
        return this._id;
    }
});
Object.defineProperty(this, "value", {
    get: function () {
        return this._value;
    },
    set: function (val) {
        this._value = val;
    }
});
Object.defineProperty(this, "required", {
    get: function () {
        return this._required;
    },
    set: function (val) {
        this._required = val;
    }
});
Object.defineProperty(this, "toolTip", {
    get: function () {
        return this._toolTip;
    },
    set: function (val) {
        this._toolTip = val;
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
Object.defineProperty(this, "displayName", {
    get: function () {
        return this._displayName;
    },
    set: function (val) {
        this._displayName = val;
    }
});
Object.defineProperty(this, "defaultValue", {
    get: function () {
        return this._defaultValue;
    },
    set: function (val) {
        this._defaultValue = val;
    }
});
Object.defineProperty(this, "valueHasBeenSet", {
    get: function () {
        return this._valueHasBeenSet;
    },
    set: function (val) {
        this._valueHasBeenSet = val;
    }
});





//methods
this.render = function (form, parent, placeholder, editable, user, idprefix) {
    //   console.log("fieldBase.render()");
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
    ret += "<div id=" + idprefix + "_" + this.id + " value='" + this.value + "'>" + this.value + "</div>";

    ret += "</div>";
    return ret;
};
this.readValue = function (placeholder) {
    console.log("fieldBase.readValue()");

};
this.ctor = function () {
    this._id = "";
    this._value = "";
    this._required = false;
    this._toolTip = "Tooltip";
    this._description = "Description";
    this._displayName = "Label";
    this._defaultValue = "";
    this._valueHasBeenSet = false;
    this._type = "fieldBase";
    this._form = null;
    this._parent = null;
}
this.dispose = function () {

}
this.findField = function (idwithprefix) {
    //   console.log("fieldBase.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        //      console.log("fieldBase.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}

