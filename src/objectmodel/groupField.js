// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._children = new Array();
this._repeater = false;



var helper = require("./utils.js");

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _defaultValue: { group: 'Field Settings', name: 'Default value', description: 'Defaut value for the field.', showHelp: true },
    _required: { group: 'Repeater Settings', name: 'Required', description: 'Is at least one row required?', showHelp: true },
    _repeater: { group: 'Repeater Settings', name: 'Repeater', description: 'Is this container repeater for subrecords?', showHelp: true },
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
Object.defineProperty(this, "repeater", {
    get: function () {
        return this._repeater;
    },
    set: function (val) {
        this._repeater = val;
    }
});
Object.defineProperty(this, "requireOneRow", {
    get: function () {
        return this._requireOneRow;
    },
    set: function (val) {
        this._requireOneRow = val;
    }
});
Object.defineProperty(this, "children", {
    get: function () {
        return this._children;
    },
    set: function (val) {
        this._children = val;
    }
});

this.render = function (form, parent, placeholder, editable, user, idprefix) {
    //    console.log("groupField.render()");
    this._form = form;
    this._parent = parent;
    this._lastCumulativeId = idprefix + "_" + this.id;
    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadGroupBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + idprefix + "_" + this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><fieldset class='datachiefField'><legend title='" + this.toolTip + "'>" + this.displayName + "</legend>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    //  if (editable)
    //     ret += "<ul id='sortable_" + idprefix + "_" +  this.id + "'>";
    for (var i in this._children) {
        ret += this._children[i].render(form, this, placeholder, editable, user, idprefix + "_" + this.id);
        ret += "<br />"
    }
    //  if (editable)
    //     ret += "</ul>"
    ret += "</fieldset></div>";

    return ret;

};
this.ctor = function () {
    this._children = new Array();
    this.__proto__.ctor();
    this._type = "groupField";
    this._repeater = false;
    this._required = false;
    this._toolTip = "Tooltip";
    this._description = "Description";
    this._displayName = "Label";
    this._form = null;
    this._parent = null;
    this._defaultValue = "";
}
this.findField = function (idwithprefix) {
    console.log("groupField.findField(" + idwithprefix  + "), this._lastCumulativeId=" + this._lastCumulativeId);
    for (var i in this._children) {
        if (this._lastCumulativeId == idwithprefix) {
            //           console.log("groupField.findField(" + idwithprefix + ") FOUND");
            return this;
        }
        else
            var tmp = this._children[i].findField(idwithprefix)
        if (tmp)
            return tmp;
    }
    return null;
}