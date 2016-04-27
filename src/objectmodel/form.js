
//types
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");
var listField = require("./listField.js");
var currentDateTimeField = require("./currentDateTimeField.js");
var currentUserField = require("./currentUserField.js");

//var helper =z require("./utils.js");
 
module.exports.exampleForms = ["Vehicle Usage Log", "Employee Vacation Request Form", "Corrective action - quality management"];


// fields

this._name = "New Form";
this._description = "Description";
this._footer = "Footer";
this._version = "0";
this._author = "user";
this._lastTimeTemplatechanged = new Date();
this._children = new Array();
this._id = "";
this.idprefix = "dcform";
this.placeHolderPrefix = "";

this.workflow;
this.broadCastRecievers;
this.finalStep;
this.allowLocalCopies;

// metadata for editing in jqPropertyGrid
this._propsMeta = {
    // Since string is the default no nees to specify type
    _name: { group: 'Form Settings', name: 'Name', description: 'Name of the form.', showHelp: true },
    _version: { browsable: false, group: 'Form Settings', name: 'Version', description: 'Form template version.', showHelp: true },
    _description: { group: 'Form Settings', name: 'Description', description: 'Description of the form.', showHelp: true },
    _footer: { group: 'Form Settings', name: 'Footer', description: 'Footer of the form.', showHelp: true },
    _author: { group: 'Ownership', name: 'Author', description: 'Who made this the form?', showHelp: true },
    _lastTimeTemplatechanged: { group: 'Ownership', name: 'Changed', type: 'label', description: 'Last time template structure changed.', showHelp: true },
    _children: { browsable: false },
    _propsMeta: { browsable: false },
    _id: { browsable: false },
    _lastPlaceholder: { browsable: false },
    _lastEditable: { browsable: false },
    _lastUser: { browsable: false },
    _allUsersForImpersonation: { browsable: false },
    displayName: { browsable: false },
    placeHolderPrefix: { browsable: false },
    _lastCumulativeId: { browsable: false },
    validator: { browsable: false },
    idprefix: { browsable: false },
    workflow: { group: 'Workflow', name: 'Workflow', description: 'Workflow steps delimited with semicolon (;), except last one - the final step of workflow. Also, firts step (creation of form by initiator) is not listed here. You choose first step by publishing form to the people who needs to create(initiate) this form. Multiple recipients can be specified within one step delimited with comma(,). If so, user, when sending form to that workflow step will be ble to choose recipient. ', showHelp: true },
    publishTo: { group: 'Workflow', name: 'Publish To', description: 'Enter comma separated emails of users you wish to publish.', showHelp: true },
    broadcastStatusOfForm: { group: 'Workflow', name: 'Broadcast status of form', description: '', showHelp: true },
    broadCastRecievers: { group: 'Workflow', name: 'Broadcast recievers', description: 'To whom you wish to notify when form is sent between workflow steps? Some kind of dmin in your organization who needs to supervise business processes. If not specified, no broadcast will be made.', showHelp: true },
    finalStep: { group: 'Workflow', name: 'Final step', description: 'User who collects data - filled and completed forms.', showHelp: true },
    allowLocalCopies: { group: 'Workflow', name: 'Allow local copies', description: 'Enter comma separated list of users which will have local copies of forms they have filled out - orpartially filled out.', showHelp: true }
}

//properties
Object.defineProperty(this, "children", {
    get: function() {
        return this._children;
    },
    set: function(val) {
        this._children = val;
    }
});
Object.defineProperty(this, "name", {
    get: function() {
        return this._name;
    },
    set: function(val) {
        this._name = val;
    }
});
Object.defineProperty(this, "displayName", {
    get: function() {
        return this._name;
    },

});
Object.defineProperty(this, "id", {
    get: function() {
        return this._id;
    },
    set: function(val) {
        this._id = val;
    }
});
Object.defineProperty(this, "description", {
    get: function() {
        return this._description;
    },
    set: function(val) {
        this._description = val;
    }
});
Object.defineProperty(this, "footer", {
    get: function() {
        return this._footer;
    },
    set: function(val) {
        this._footer = val;
    }
});
Object.defineProperty(this, "version", {
    get: function() {
        return this._version;
    },
    set: function(val) {
        this._version = val;
    }
});

//methods

this.refresh = function() {

    this.render(this._lastPlaceholder, this._lastEditable, this._lastUser);
}

this.render = function(placeholder, editable, user) {
    this.readValues();
    console.log("form.render(placeholder, " + editable + ", " + user + ")");
    this._lastPlaceholder = placeholder;
    this._lastEditable = editable;
    this._lastUser = user;



    this.placeHolderPrefix = $(placeholder).attr("id").replace("formPreview", "");
    this.idprefix = "dcform";
    this._lastCumulativeId = this.idprefix + "_" + this.id;
    var str = "";

    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadFormBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + this.idprefix + this.id)
    str = ctlbox + "<div id='field_" + this.idprefix + "_" + this.id + "'><h1>" + this._name +"</h1>";
    str += "<p>" + this.description + "</p>";
    //   if (editable)
    //      str += "<ul id='sortable_" + idprefix + "_" + this.id + "'>";
    for (var i in this._children) {
        //     if (editable)
        //        str += "<li class='ui-state-default'><span class='ui-icon-arrowthick-2-n-s'>";
        str += this._children[i].render(this, this, placeholder, editable, user, this.idprefix + "_" + this.id);
        //    if (editable)
        //       str += "</span></li>";
    }
    str += "<p class='help-block'></p>";
    str += "<hr />" + this._footer + "<div /><br /><button style='float:right;' type='button' class='btn btn-primary testbutton'>Submit</button>";
    //  if (editable)
    //      str += "</ul>"
    placeholder.html(str);
    //   var allCtlBoxes = "#" + placeholder.attr("id") + " [id^='" + this.idprefix + "_ctlbox_'] span";
    var allCtlBoxesSelector = "#" + placeholder.attr("id") + " [id^='ctlbox_']";

    var allCtlBoxes = $(allCtlBoxesSelector);
    //  console.log("allCtlBoxesSelector=" + allCtlBoxesSelector + " = " + allCtlBoxes.length);
    for (var s = 0; s < allCtlBoxes.length; s++) {
        var field = this.findField($(allCtlBoxes[s]).attr("id").replace("ctlbox_", ""));
        // from ctlbox wont be found
        if (!field)
            field = this;
        //      console.log("allCtlBoxes " + s + " " + $(allCtlBoxes[s]).prop("id"));
        var spans = $(allCtlBoxes[s]).find("span");
        //      console.log("spans=" +  spans.length);
        for (var i1 = 0; i1 < spans.length; i1++) {
            if (field) {
                $(spans[i1]).prop("field", field);
                $(spans[i1]).prop("_form", this);
            }

        }
        //combos
        spans = $(allCtlBoxes[s]).find("select");
        for (var i1 = 0; i1 < spans.length; i1++) {
            if (field) {

                $(spans[i1]).prop("field", field);
                $(spans[i1]).prop("_form", this);
            }

        }
    }

    this.validator = require("../dcValidator.js");
    var fp = $("#" + placeholder.attr("id"));
    this.validator.ctor(fp);
    $("#" + placeholder.attr("id")).find(".testbutton").
        prop("me", this).
        click(function() {
            if (this.me.validator.validate()) {
                $("#dialog-validation-ok").dialog({
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");
                        }
                    }
                });
            }
            else {
                $("#dialog-validation-failed").dialog({
                    modal: true,
                    buttons: {
                        Ok: function() {
                            $(this).dialog("close");
                        }
                    }
                });
            }
        });
    if (!editable) {
        var addrowbottons = $("#" + placeholder.attr("id")).find(".addbuttonMarker");
        // now we have all ADD buttons, we need to bind them to groupFiled they belong to
        for (var ind = 0; ind < addrowbottons.length; ind++) {
            var groupfieldId = $(addrowbottons[ind]).prop("id").replace("_addrow", "").replace("field_", "");
            var groupField = this.findField(groupfieldId);
            $(addrowbottons[ind]).prop("me", groupField).
                click(function() {
                    this.me._form.readValues();
                    this.me.addRow();
                    this.me._form.refresh();
                });
        }
        var removerowbottons = $("#" + placeholder.attr("id")).find(".removebuttonMarker");
        // now we have all remove buttons, we need to bind them to groupFiled they belong to
        for (var ind = 0; ind < removerowbottons.length; ind++) {
            var groupfieldId = $(removerowbottons[ind]).prop("id").replace("_removerow", "").replace("field_", "");
            var rowIndex = groupfieldId.substr(groupfieldId.lastIndexOf("_") + 1);
            groupfieldId = groupfieldId.substr(0, groupfieldId.lastIndexOf("_"))
            var groupField = this.findField(groupfieldId);
            $(removerowbottons[ind]).prop("me", groupField).prop("rowIndex", rowIndex).
                click(function() {
                    this.me._form.readValues();
                    this.me.removeRow(this.rowIndex);
                    this.me._form.refresh();
                });
        }

    }
    var signfields = $("#" + placeholder.attr("id")).find(".currentUserFieldMarker");
    // now we have all sign fields, we need to bind them to actuon buttons
    for (var ind = 0; ind < signfields.length; ind++) {
        var signButton = $("#" + $(signfields[ind]).prop("id") + "_button");
        var f = this.findField($(signfields[ind]).prop("id"));
        $(signButton).prop("field", f).
            click(function() {
                if ($("#" + this.field._lastCumulativeId).val() == "") {
                    $("#" + this.field._lastCumulativeId).val(userSettings.email);
                    this.field._value = userSettings.email;
                }
                else {
                    $("#" + this.field._lastCumulativeId).val("");
                    this.field._value = "";
                }
                this.field._form.refresh();
            });
    }
    var timestampfields = $("#" + placeholder.attr("id")).find(".currentDateTimeFieldMarker");
    // now we have all sign fields, we need to bind them to actuon buttons
    for (var ind = 0; ind < timestampfields.length; ind++) {
        var timestampButton = $("#" + $(timestampfields[ind]).prop("id") + "_button");
        var f = this.findField($(timestampfields[ind]).prop("id"));
        $(timestampButton).prop("field", f).
            click(function() {
                if ($("#" + this.field._lastCumulativeId).val() == "") {
                    var d = new Date().toISOString().replace('Z', '');
                    $("#" + this.field._lastCumulativeId).val(d);
                    this.field._value = d;
                }
                else {
                    $("#" + this.field._lastCumulativeId).val("");
                    this.field._value = "";
                }
                this.field._form.refresh();
            });
    }

};

this.readValues = function() {

    var renderedFields = $("[id^='" + this.idprefix + "_" + this.id + "']");
    for (var i = 0; i < renderedFields.length; i++) {

        var field = this.findField($(renderedFields[i]).prop("id"));
        if (field) {
            field.value = $(renderedFields[i]).val();
        }
    }

};


this.createForm = function(name, templateName) {
    this._name = name;
    this._version = "0";
    this._author = userSettings.email;
    this._lastTimeTemplatechanged = new Date();
    if (!templateName.length) {
        this._description = "My empty Form.";
        this._footer = "Footer of empty Form.";
        return;
    }


    switch (templateName) {
        case "Vehicle Usage Log":

            this._description = "The details of the use of a company-owned vehicle should be recorded by the operator so as to produce an accurate and complete log of the use of the vehicle. The log should be filled out while using the vehicle, not the next day.";
            this._footer = "This is an simple example DataChief Form. It shows basic usage of Fileds in DataChief and simple Workflow.";

            var txt;

            var grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Vehicle usage details";
            grp.toolTip = "Enter detailed infromation.";
            grp.description = "Provide detailed information regarding vehicle usage."
            this.children.push(grp);

            var lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Vehicle used";
            lst.options = "BMW 328i (Plate N#XX-XXXX);Ford F-150 (Plate N#XX-XXXX);Toyota Camry (Plate N#XX-XXXX);Nissan Leaf (Plate N#XX-XXXX);Nissan Leaf 2016 (Plate N#XX-XXXX)"
            lst.description = "Choose vehicle used"
            lst.toolTip = lst.description;
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Reason or Work order#";
            txt.description = "Why do you need this vehicle?";
            txt.toolTip = "Enter work order nuber, or describe why you need this vehicle.";
            txt.multiline = true;
            txt.required = true;
            grp.children.push(txt);

            var grp1 = Object.create(groupField);
            grp1.ctor();
            grp1.displayName = "Mileage details";
            grp1.toolTip = "Enter mileage details here.";
            grp1.description = "Provide detailed information regarding vehicle mileage."
            grp.children.push(grp1);


            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Start date and time";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Start odometer";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "End date and time";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "End odometer";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            grp1.children.push(txt);

            lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Choose special usage conditions (if any)";
            lst.description = "Choose all that apply";
            lst.toolTip = "Did you used this car in a way thet is considered heavy duty?";
            lst.options = "Towing;Off-road;Heavy load;Track racing or other prolonged heavy breaking situations";
            lst.multiselect = true
            grp.children.push(lst);

            lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Is vehicle in working order?";
            lst.toolTip = "Is vehicle in working order?";
            lst.description = "Car is not damaged and everything is in order?"
            lst.options = "Yes;No;Service is needed";
            lst.multiselect = false;
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Notes on vehicle state";
            txt.description = "Enter notes here if something is broken or damaged on the vehicle.";
            txt.toolTip = "What have you noticed, if anything, regarding vehicle state?";
            txt.multiline = true;
            txt.required = false;
            grp.children.push(txt);

            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Signature";
            grp.toolTip = "Your signature.";
            grp.description = ""
            this.children.push(grp);

            var cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "";
            grp.children.push(cu);

            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Review";
            grp.toolTip = "Reviewer signature.";
            grp.description = ""
            this.children.push(grp);

            cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "";
            grp.children.push(cu);

            lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Is this log correctly filled out?";
            lst.toolTip = "Revier needs to review this log?";
            lst.description = "Choose coclusion?"
            lst.options = "Yes;No;There is room for improvements";
            lst.multiselect = false;
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Comment";
            txt.description = "Reviewer comment and recomendation.";
            txt.toolTip = "Optional reviewer comment and recomendation";
            txt.multiline = true;
            txt.required = false;
            grp.children.push(txt);
            break;
        case "Employee Vacation Request Form":
            this._description = "this Vacation / leave request form should be submitted by employee and then approved by manager.";
            this._footer = "Example Employee Vacation Request Form.";
            break;
        case "Corrective action - quality management":
            this._description = "Corrective / preventive actions are implemented in response to customer complaints, unacceptable levels of product non-conformance, issues identified during internal, external or thirs party audit(s), adverse or unstable trends in product and process monitoring or any other non-conformity with policies and procedures.";
            this._footer = "Example Corrective action Form.";
            break;
    }
}
this.ctor = function() {
    this._children = new Array();
    this._allUsersForImpersonation = new Array();
    this.workflow = "";
    this.broadCastRecievers = "initiator";
    this.finalStep = "initiator";
    this.allowLocalCopies = "initiator";
    this.publishTo = "user1@example.com, user2@example.com";
    this._id = helper.generateGUID();
}
this.regenerateGUID = function() {
    this._id = helper.generateGUID();
}
this.dispose = function() {

}
this.findField = function(idwithprefix) {
    //      console.log("form.findField(" + idwithprefix + "), this._lastCumulativeId=" + this._lastCumulativeId);
    if (this._lastCumulativeId == idwithprefix) {
        console.log("groupField.findField(" + idwithprefix + ") FOUND");
        return this;
    }
    else {
        for (var i in this._children) {
            var tmp = this._children[i].findField(idwithprefix)
            if (tmp)
                return tmp;
        }
    }
    return null;

}