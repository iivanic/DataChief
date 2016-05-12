// iherit from base class
this.__proto__ = require("./fieldBase.js");

this._children = new Array();
this._newRowTemplate = new Array();
this._dataRows = new Array();
this._repeater = false;
this.editors = "";
this._disabled;
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");
var listField = require("./listField.js");
var currentDateTimeField = require("./currentDateTimeField.js");
var currentUserField = require("./currentUserField.js");

//var helper = require("./utils.js");

this._propsMeta = {
    // Since string is the default no nees to specify type
    _displayName: { group: 'Field Settings', name: 'Name', description: 'Name of the field.', showHelp: true },
    _toolTip: { group: 'Field Settings', name: 'Tooltip', description: 'Tooltip ofr the field.', showHelp: true },
    _description: { group: 'Field Settings', name: 'Description', description: 'Description of the field.', showHelp: true },
    _defaultValue: { browsable: false },
    _required: { group: 'Repeater Validation', name: 'Required', description: 'Is at least one row required when repeater?', showHelp: true },
    _requiredErrorMessage: { group: 'Repeater Validation', name: 'Required error message', description: 'Massege whe required row of fields is missing.', showHelp: true },
    _repeater: { group: 'Repeater Settings', name: 'Repeater', description: 'Is this container repeater for subrecords?', showHelp: true },
    _valueHasBeenSet: { browsable: false },
    _children: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastCumulativeId: { browsable: false },
    _form: { browsable: false },
    _parent: { browsable: false },
    _editable: { browsable: false },
    _type: { browsable: false },
    _handleRenderStyleCounter: { browsable: false },
    _maxHandleRenderStyleCounter: { browsable: false },
    _colWidth: { browsable: false },
    _disabled: { browsable: false },
    _dataRows: { browsable: false },
    editors: { group: 'Workflow', name: 'Editors', description: 'Define who, in the workflow, can edit or fill out this container. Default is \'initiator\', multiple users separate with comma.', showHelp: true },
    _newRowTemplate: { browsable: false },
    _renderStyle: { name: 'Render Style', group: 'Field Settings', type: 'options', options: [{ text: 'One column', value: '0' }, { text: 'Two columns', value: '1' }, { text: 'Three columns', value: '2' }], description: 'How to display fields?' }
}

//properties
Object.defineProperty(this, "repeater", {
    get: function() {
        return this._repeater;
    },
    set: function(val) {
        if (val != this._repeater) {
            // there is change,
            // we will swap _newRowTemplate and _children
            var tmp = this._children;
            this._children = this._newRowTemplate;
            this._newRowTemplate = tmp;
        }
        this._repeater = val;
    }
});
Object.defineProperty(this, "requireOneRow", {
    get: function() {
        return this._requireOneRow;
    },
    set: function(val) {
        this._requireOneRow = val;
    }
});
Object.defineProperty(this, "children", {
    get: function() {
        return this._children;
    },
    set: function(val) {
        this._children = val;
    }
});
Object.defineProperty(this, "newRowTemplate", {
    get: function() {
        return this._newRowTemplate;
    },
    set: function(val) {
        this._newRowTemplate = val;
    }
});

this.render = function(form, parent, placeholder, editable, user, idprefix) {
    //    console.log("groupField.render()");
    this._form = form;
    this._parent = parent;
    this._editable = editable;
    this._lastCumulativeId = idprefix + "_" + this.id;
    var disabled = ((helper.checkUser(user , this.editors) || this._parent._disabled) && !editable ? "disabled" : "");
    this._disabled = disabled == "disabled";
    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadGroupBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + idprefix + "_" + this.id)
    var ret = "";
    if (editable)
        ret += ctlbox;
    ret += "<div id='field_" + idprefix + "_" + this.id + "' class='datachiefFieldRow'><fieldset " + disabled + " class='datachiefField'><legend title='" + this.toolTip + "'>" + this.displayName + "</legend>";
    //+ ", c="  + this._children.length + " t="  + this._newRowTemplate.length + " dr="  +  this._dataRows.length + "</legend>";
    ret += "<p title='" + this.toolTip + "'>" + this.description + "</p>";
    //  if (editable)
    //     ret += "<ul id='sortable_" + idprefix + "_" +  this.id + "'>";
    this.resetHandleRenderStyle();
    if (!this._repeater) {
        for (var i in this._children) {
            ret += this.handleRenderStyle();
            ret += this._children[i].render(form, this, placeholder, editable, user, idprefix + "_" + this.id);
            ret += this.handleRenderStyle();
        }
    }
    else {
        if (editable) {
            ret += "<fieldset class='datachiefField'><legend title=''>This is template for new row. Switch to Preview mode to test it.</legend>";
            for (var j in this._newRowTemplate) {
                ret += this.handleRenderStyle();
                ret += this._newRowTemplate[j].render(form, this, placeholder, editable, user, idprefix + "_" + this.id)
                ret += this.handleRenderStyle();

            }
            ret += "</fieldset>";
        }
        else {
            var odd_even = 1;
            for (var j in this._dataRows) {
                ret += "<div style='border:1px dashed silver;background-color:" + (odd_even % 2 ? "#EEEEEE" : "none") + "'>";
                for (var i in this._dataRows[j]) {
                    ret += this.handleRenderStyle();
                    ret += this._dataRows[j][i].render(form, this, placeholder, editable, user, idprefix + "_" + this.id);
                    ret += this.handleRenderStyle();

                }
                odd_even++;
                ret += "</div>";
                ret += "<button style='float:right;' id='field_" + idprefix + "_" + this.id + "_removerow_" + j + "' type='button' class='btn btn-secondary removebuttonMarker'>Remove</button><br/><br/>";
            }
            ret += "<button style='float:right;' id='field_" + idprefix + "_" + this.id + "_addrow' type='button' class='btn btn-primary addbuttonMarker'>Add</button>";

        }
    }
    ret += "<p class='help-block'></p>";
    //  if (editable)
    //     ret += "</ul>"
    ret += "</fieldset></div>";

    // fill _allUsersForImpersonation
    var tmpArr = this.editors.split(',');
    for (var tmpI = 0; tmpI < tmpArr.length; tmpI++)
        form._allUsersForImpersonation.push(tmpArr[tmpI]);
    return ret;

};
this.ctor = function() {
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
    this.editors = "initiator";
    this._requiredErrorMessage = "At least one subrecord is required.";
    this._newRowTemplate = new Array();
    this._dataRows = new Array();
    this._renderStyle = "0";
}
this.findField = function(idwithprefix) {
    //  console.log("groupField.findField(" + idwithprefix + "), this._lastCumulativeId=" + this._lastCumulativeId);
    if (this._lastCumulativeId == idwithprefix) {
        //     console.log("groupField.findField(" + idwithprefix + ") FOUND");
        return this;
    }
    else {
        var tmp = null;

        for (var i in this._children) {
            tmp = this._children[i].findField(idwithprefix)
            if (tmp)
                return tmp;
        }
        if (this._repeater) {
            if (this._editable)
                for (var i in this._newRowTemplate) {
                    tmp = this._newRowTemplate[i].findField(idwithprefix)
                    if (tmp)
                        return tmp;
                }
            else
                for (var i in this._dataRows) {
                    for (var j in this._dataRows[i]) {
                        tmp = this._dataRows[i][j].findField(idwithprefix)
                        if (tmp)
                            return tmp;
                    }
                }

        }
    }
    return null;

}


// ----------------------  render styles   ---------------------------
this._handleRenderStyleCounter = 0;
this._maxHandleRenderStyleCounter = 0;
this._colWidth = "";
this.resetHandleRenderStyle = function() {
    switch (this._renderStyle) {

        case "1":
            this._handleRenderStyleCounter = 3;
            this._colWidth = "6";
            break;
        case "2":
            this._handleRenderStyleCounter = 5;
            this._colWidth = "4";
            break;
        default:
            this._handleRenderStyleCounter = 1;
            this._colWidth = "12";
            break;
    }
    this._maxHandleRenderStyleCounter = this._handleRenderStyleCounter;
    //  console.log("resetHandleRenderStyle for " + this._id + ", _handleRenderStyleCounter=" + this._handleRenderStyleCounter + ", _colWidth=" + this._colWidth);
}
this.handleRenderStyle = function() {
    // console.log("handleRenderStyle for " + this._id + ", _handleRenderStyleCounter=" + this._handleRenderStyleCounter + ", _colWidth=" + this._colWidth);

    var ret = "";
    //row start
    if (this._handleRenderStyleCounter == this._maxHandleRenderStyleCounter)
        ret += "<div class='row'>"


    if (this._handleRenderStyleCounter % 2)
        ret += "<div class='col-sm-" + this._colWidth + "'>"
    else
        ret += "</div>";

    if (this._handleRenderStyleCounter == 0) {
        ret += "</div>";
        this.resetHandleRenderStyle();
    }
    else
        this._handleRenderStyleCounter--;

    return ret;
}
this.removeRow = function(rowIndex) {
//    console.log("Removing datarow with index " + rowIndex);
    this._dataRows.splice(rowIndex, 1);
}
this.addRow = function() {
//    console.log("addRow");
    // clone _newRowTemplate and and it to _dataRows
    var row = new Array();
    for (var i in this._newRowTemplate) {
        var field = null;
        switch (this._newRowTemplate[i]["_type"]) {
            case "listField":
                field = Object.create(listField);
                field.ctor();
                break;
            case "textField":
                field = Object.create(textField);
                field.ctor();
                break;
            case "fieldBase":
                field = Object.create(fieldBase);
                field.ctor();
                break;
            case "groupField":
                field = Object.create(groupField);
                field.ctor();
                break;
            case "currentDateTimeField":
                field = Object.create(currentDateTimeField);
                field.ctor();
                break;
            case "currentUserField":
                field = Object.create(currentUserField);
                field.ctor();
                break;

        }
        row.push(field);
        for (var attrname in this._newRowTemplate[i]) {
            if (attrname == "_children" || attrname == "_dataRows" || attrname == "_newRowTemplate") {
  //              console.log("aaa Gonnload children for " + attrname);
                loadChildren(field,
                    this._newRowTemplate[i][attrname]
                    , attrname);
            }
            else {
                field[attrname] = this._newRowTemplate[i][attrname];
    //            console.log("r copy " + attrname); //+ "=" + this._newRowTemplate[i][attrname]);
            }

        }
    }
    this._dataRows.push(row);
}
function loadChildren(parent, obj, aname) {
 //   console.log("gf-loadChildren(p=" + parent + ", t=" + obj._type + ", parent field name=" + aname + ")");

    var field;
    if (obj._type) {
        switch (obj["_type"]) {
            case "listField":
                field = Object.create(listField);
                field.ctor();
                break;
            case "textField":
                field = Object.create(textField);
                field.ctor();
                break;
            case "fieldBase":
                field = Object.create(fieldBase);
                field.ctor();
                break;
            case "groupField":
                field = Object.create(groupField);
                field.ctor();
                break;
            case "currentDateTimeField":
                field = Object.create(currentDateTimeField);
                field.ctor();
                break;
            case "currentUserField":
                field = Object.create(currentUserField);
                field.ctor();
                break;

        }
        if (aname == "_children")
            parent._children.push(field);
        if (aname == "_dataRows")
            parent._dataRows.push(field);
        if (aname == "_newRowTemplate")
            parent._newRowTemplate.push(field);
        //         console.log("loadChildren() added " + field._type );
        for (var arrayEl in obj) {
            if (arrayEl == "_children" || arrayEl == "_dataRows" || arrayEl == "_newRowTemplate") {
  //              console.log("Gonnload children for " + arrayEl);
                loadChildren(field, obj[arrayEl], arrayEl);
            }
            else {
                field[arrayEl] = obj[arrayEl];
  //              console.log("copy " + arrayEl); //+ "=" + obj[arrayEl]);
            }
        }
    }
    else {
        // its an array
   //     console.log("it's an Array");
        for (var arrayEl in obj) {
      //      console.log("arr Gonnload children for " + aname);

            loadChildren(parent, obj[arrayEl], aname);
        }
    }

    return;
}