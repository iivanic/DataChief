// ------------------------------------
// base class for all field types...
// ------------------------------------


var helper = require("./utils.js");

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

//properties
Object.defineProperty(this, "id", {
    get: function () {
        if (this._id == "")
        {
            this._id = helper.generateGUID();
            console.log("ID GENERATED!");
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
this.render = function (placeholder, editable, user, idprefix) {
    console.log("fieldBase.render()");
    this._lastCumulativeId = idprefix + "_" + this.id;
    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadFieldBox();
    ctlbox = ctlbox.replace('{id}',"ctlbox_" + idprefix + "_" +  this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div class='datachiefFieldRow'><label for='" + idprefix + "_" + this.id + "' title='" + this.toolTip + "'>" + this.displayName +
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
}
this.dispose = function () {

}
this.findField = function (idwithprefix) {
 //   console.log("fieldBase.findField(" + idwithprefix + ")");

    if (this._lastCumulativeId == idwithprefix) {
        console.log("fieldBase.findField(" + idwithprefix + ") FOUND");
        return this;
    }

    return null;
}

