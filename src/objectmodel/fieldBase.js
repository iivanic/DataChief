// ------------------------------------
// base class for all field types...
// ------------------------------------


var helper = require("./utils.js");

//fields
this._id = "";
this._value = "";
this._toolTip = "Tooltip";
this._description = "Description";
this._displayName = "Label";
this._defaultValue = "";
this._valueHasBeenSet = false;


//properties
Object.defineProperty(this, "id", {
    get: function () {
        if (this._id == "")
            this._id = helper.generateGUID();
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
Object.defineProperty(this, "parentElement", {
    get: function () {
        return this._parentElement;
    }
});



//methods
this.render = function (placeholder) {
    console.log("fieldBase.render()");
    var ret = "";
    ret += "<div>fieldBase";
    ret += "</div>";
    return ret;
};
this.readValue = function (placeholder) {
    console.log("fieldBase.readValue()");

};
this.ctor = function () {

}
this.dispose = function () {

}

