// ------------------------------------
// base class for all field types...
// ------------------------------------


var helper = require("./utils.js");

//fields
this._id = "";
this._value = "";
this._toolTip = "";
this._description = "";
this._displayName = "";
this._defaultValue = "";
this._valueHasBeenSet = false;

this._parentElement=null;

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
        this._toolTip= val;
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
this.render = function () {
    console.log("fieldBase.render()");
};
this.readValue = function () {
   console.log("fieldBase.readValue()");

};
this.ctor = function (parentElement) {
  this._parentElement=parentElement;
}

