
//types
var groupField = require("./groupField.js");
var textField = require("./textField.js");
var fieldBase = require("./fieldBase.js");
var listField = require("./listField.js");
var currentDateTimeField = require("./currentDateTimeField.js");
var currentUserField = require("./currentUserField.js");

//var helper =z require("./utils.js");

module.exports.exampleForms = ["Vehicle Usage Log", "Employee Absence Request", "Corrective action - Quality Management"];


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
this.allowSendOneStepBack = true //

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
    workflow: { group: 'Workflow', name: 'Workflow', description: 'Workflow steps delimited with semicolon (;) or coma(,), except last one - the final step of workflow. Also, firts step (creation of form by initiator) is not listed here. You choose first step by publishing form to the people who needs to create(initiate) this form. Multiple recipients can be specified within one step grouped with brackets (). After brackets you can also specify how many times users within the group can send forms between themselves. User, when sending form to that workflow step will be ble to choose recipient. ', showHelp: true },
    publishTo: { group: 'Workflow', name: 'Publish To', description: 'Enter comma or semicolon separated emails of users you wish to publish.', showHelp: true },
    broadcastStatusOfForm: { group: 'Workflow', name: 'Broadcast status of form', description: '', showHelp: true },
    broadCastRecievers: { group: 'Workflow', name: 'Broadcast recievers', description: 'Enter comma or semicolon separated emails of users to whom you wish to notify when form is sent between workflow steps? Some kind of admin in your organization who needs to supervise business processes. If not specified, no broadcast will be made.', showHelp: true },
    finalStep: { group: 'Workflow', name: 'Final step', description: 'Enter comma or semicolon separated emails of user(s) who collects data - filled and completed forms.', showHelp: true },
    allowLocalCopies: { group: 'Workflow', name: 'Allow local copies', description: 'Enter comma or semicolon separated list of users which will have local copies of forms they have filled out - or partially filled out.', showHelp: true },
    allowSendOneStepBack: { group: 'Workflow', name: 'Allow return', description: 'Allow users to send form one step back in the workflow (for additional refinment, for example).', showHelp: true }
}

//properties
Object.defineProperty(this, "children", {
    get: function () {
        return this._children;
    },
    set: function (val) {
        this._children = val;
    }
});
Object.defineProperty(this, "name", {
    get: function () {
        return this._name;
    },
    set: function (val) {
        this._name = val;
    }
});
Object.defineProperty(this, "displayName", {
    get: function () {
        return this._name;
    },

});
Object.defineProperty(this, "id", {
    get: function () {
        return this._id;
    },
    set: function (val) {
        this._id = val;
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
Object.defineProperty(this, "footer", {
    get: function () {
        return this._footer;
    },
    set: function (val) {
        this._footer = val;
    }
});
Object.defineProperty(this, "version", {
    get: function () {
        return this._version;
    },
    set: function (val) {
        this._version = val;
    }
});

//methods

this.refresh = function () {

    this.render(this._lastPlaceholder, this._lastEditable, this._lastUser);
}

this.render = function (placeholder, editable, user, _idprefix) {
    this.readValues();
    console.log("form.render(placeholder, " + editable + ", " + user + ")");
    this._lastPlaceholder = placeholder;
    this._lastEditable = editable;
    this._lastUser = user;

    this.placeHolderPrefix = $(placeholder).attr("id").replace("formPreview", "");
    if (!_idprefix)
        _idprefix = "dcform"
    this.idprefix = _idprefix;
    this._lastCumulativeId = this.idprefix + "_" + this.id;
    var str = "";

    var ctlbox = "";
    if (editable)
        ctlbox = helper.loadFormBox();
    ctlbox = ctlbox.replace('{id}', "ctlbox_" + this.idprefix + this.id)
    str = ctlbox + "<div id='field_" + this.idprefix + "_" + this.id + "'><h1>" + this._name + "</h1>";
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
    str += "<hr />" + this._footer + "<div /><br /><button style='float:right;' type='button' class='btn btn-primary testbutton'>Validate</button>";
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
        click(function () {
            if (this.me.validator.validate()) {
                $("#dialog-validation-ok").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
                            $(this).dialog("close");
                        }
                    }
                });
            }
            else {
                $("#dialog-validation-failed").dialog({
                    modal: true,
                    buttons: {
                        Ok: function () {
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
                click(function () {
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
                click(function () {
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
            click(function () {
                if ($("#" + this.field._lastCumulativeId).val() == "") {
                    $("#" + this.field._lastCumulativeId).val(helper.extractUser(user));
                    this.field._value = helper.extractUser(user);
                }
                else {
                    $("#" + this.field._lastCumulativeId).val("");
                    this.field._value = "";
                }
                this.field._form.refresh();
            });
    }
    var gPSfields = $("#" + placeholder.attr("id")).find(".currentGPSPositionFiledMarker");
    // now we have all sign fields, we need to bind them to action buttons
    for (var ind = 0; ind < gPSfields.length; ind++) {
        var gPSButton = $("#" + $(gPSfields[ind]).prop("id") + "_button");
        var f = this.findField($(gPSfields[ind]).prop("id"));
        $(gPSButton).prop("field", f).
            click(function () {
                if ($("#" + this.field._lastCumulativeId).val() == "") {
                    this.field.getPosition();
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
            click(function () {
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

this.readValues = function () {

    var renderedFields = $("[id^='" + this.idprefix + "_" + this.id + "']");
    for (var i = 0; i < renderedFields.length; i++) {

        var field = this.findField($(renderedFields[i]).prop("id"));
        if (field) {
            field.value = $(renderedFields[i]).val();
        }
    }

};

this.createFeedbackForm = function () {
    this.ctor();
    this._name = "DataChief User Feedback";
    this._version = "1";
    this._author = "iivanic";
    this._lastTimeTemplatechanged = new Date();

    this._description = "This form is used for providing feeedback to DataChief Author(s) and bug reporting. Note that You can view open issues at <a href='https://github.com/iivanic/DataChief/issues'>https://github.com/iivanic/DataChief/issues</a>.";
    this._footer = "DataChief feedback, issues and bug reporting form.";
    this.workflow = "";
    this.publishTo = "everyone";
   

    //this bellow should not be used or documented:
    //hash (#) infront of email forces sending 
    //form to that email, even in 
    //Single user account Operating mode
    //problem is that there may not be configured
    //SMTP account at this time
    this.finalStep = "#igor_ivanic@hotmail.com";
    this.broadCastRecievers = "";
 //   this.broadcastStatusOfForm = true;

    var grp = Object.create(groupField);
    grp.ctor();
    grp.displayName = "Details";
    grp.toolTip = "Describe issue or write your Feedback.";
    grp.description = "Describe issue or write your Feedback."
    this.children.push(grp);

    var lst = Object.create(listField);
    lst.ctor();
    lst.displayName = "Type";
    lst.options = "Feedback;Issue;Bug"
    lst.description = "Type of Feedback"
    lst.toolTip = "Choose " + lst.description;
    lst.required = true;
    grp.children.push(lst);

    var txt = Object.create(textField);
    txt.ctor();
    txt.displayName = "Comment";
    txt.description = "Enter Your Commnent. If Bug or Issue, plese include steps to reproduce behavior.";
    txt.toolTip = "Enter Your Commnent";
    txt.multiline = true;
    txt.required = true;
    grp.children.push(txt);

    var cu = Object.create(currentDateTimeField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);
    cu = Object.create(currentUserField);
    cu.ctor();
    cu.description = "";
    grp.children.push(cu);
}
this.createForm = function (name, templateName) {
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
            this._id="121b3699-ebf3-4e2f-881b-6f025395bef2";
            this._description = "The details of the use of a company-owned vehicle should be recorded by the operator so as to produce an accurate and complete log of the use of the vehicle. The log should be filled out while using the vehicle, not the next day.";
            this._footer = "This is an simple example DataChief Form. It shows basic usage of Fileds in DataChief and simple Workflow.";
            this.publishTo="jennifer@barriqueworks.com,michael@barriqueworks.com,elizabeth@barriqueworks.com";
            this.workflow = "patricia@barriqueworks.com";
            this.finalStep = "richard@barriqueworks.com";
            this.broadCastRecievers = "richard@barriqueworks.com";
            this.allowLocalCopies = "everyone";
     
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
            txt._inputType = "datetime-local";
            txt._multiline = false;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Start odometer";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "number";
            txt._multiline = false;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "End date and time";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "datetime-local";
            txt._multiline = false;
            grp1.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "End odometer";
            txt.description = "";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "number";
            txt._multiline = false;
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
            grp.editors = "patricia@barriqueworks.com";
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
        case "Employee Absence Request":
            this._id="72293ebe-b9db-4539-be61-42ad5611e5ab";
            this._description = "This Absence Request form should be submitted by employee and then approved by HR and Manager.";
            this._footer = "Example Absence Request Request Form.";
            this.workflow = "john@barriqueworks.com,robert@barriqueworks.com";
            this.publishTo = "william@barriqueworks.com,linda@barriqueworks.com,david@barriqueworks.com";
            this.finalStep = "john@barriqueworks.com";
            this.broadCastRecievers = "initiator, john@barriqueworks.com";
            this.allowLocalCopies = "everyone";

            var grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Absence Request";
            grp.toolTip = "Enter Absence Request detailed infromation.";
            grp.description = "Provide detailed information regarding your Absence Request. You must submit requests for absences, other than medical leave, two days prior to the first day you will be absent. "
            grp.editors = "initiator";
            this.children.push(grp);

            var lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Type of Absence Requested";
            lst.description = "Specify kind of Absence you are requesting.";
            lst.toolTip = "Are you requesting Medical Leave, Vacation or?";
            lst.options = "Medical;Vacation;Bereavement;Time Off Without Pay;Military;Jury Duty;Maternity/Paternity;Other";
            lst.multiselect = false
            lst.required = true;
            grp.children.push(lst);

            var txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Start";
            txt.description = "Absence Start date";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "date";
            txt._multiline = false;
            grp.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "End";
            txt.description = "Absence end date";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "date";
            grp.children.push(txt);
            txt._multiline = false;

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Reason";
            txt.description = "Describe reason for Absence";
            txt.toolTip = "";
            txt.multiline = true;
            txt.required = true;

            grp.children.push(txt);
            txt._multiline = true;

            var cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "User Signature";
            grp.children.push(cu);

            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "HR approval";
            grp.toolTip = "HR must approve or disaprove this request.";
            grp.description = "HR must approve or reject this request."
            grp.editors = "john@barriqueworks.com";
            this.children.push(grp);

            lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Aproval";
            lst.options = "Approved;Rejected"
            lst.description = "Approval of Absence request."
            lst.toolTip = lst.description;
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Comments";
            txt.description = "Comments for approval (if any)";
            txt.toolTip = "";
            txt.multiline = true;
            txt.required = false;
            grp.children.push(txt);

            cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "Signature";
            grp.children.push(cu);

           
            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Manager approval";
            grp.toolTip = "Manager must approve or disaprove this request.";
            grp.description = "Manager must approve or reject this request."
            grp.editors = "robert@barriqueworks.com";
            this.children.push(grp);

            lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Aproval";
            lst.options = "Approved;Rejected"
            lst.description = "Aproval of Absence request."
            lst.toolTip = lst.description;
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Comments";
            txt.description = "Comments for approval (if any)";
            txt.toolTip = "";
            txt.multiline = true;
            txt.required = false;
            grp.children.push(txt);

            cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "Manager Signature";
            grp.children.push(cu);

            break;
        case "Corrective action - Quality Management":
            this._id="d0b3b522-230e-4de4-ab4a-1c54fe7965cd";
            this._description = "Corrective / preventive actions are implemented in response to customer complaints, unacceptable levels of product non-conformance, issues identified during internal, external or thirs party audit(s), adverse or unstable trends in product and process monitoring or any other non-conformity with policies and procedures.";
            this._footer = "Example Corrective action Form.";

            this.workflow = "daniel@barriqueworks.com";
            //everyone in the company
            this.publishTo = "mary@barriqueworks.com,richard@barriqueworks.com,john@barriqueworks.com,daniel@barriqueworks.com,james@barriqueworks.com,patricia@barriqueworks.com,jennifer@barriqueworks.com,michael@barriqueworks.com,elizabeth@barriqueworks.com,margaret@barriqueworks.com,robert@barriqueworks.com,william@barriqueworks.com,linda@barriqueworks.com,david@barriqueworks.com";
            this.finalStep = "daniel@barriqueworks.com";
            this.broadCastRecievers = "";
           

            var grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Description";
            grp.toolTip = "Non-conformitiy/potential non-conformity description";
            grp.description = "Provide detailed information regarding non-conformitiy/potential non-conformity."
            grp.editors = "initiator";
            this.children.push(grp);

            var txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Description";
            txt.description = "Description of non-conformitiy/potential non-conformity";
            txt.toolTip = "";
            txt.required = true;
            txt._multiline = true;
            grp.children.push(txt);

            var cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "Signature";
            grp.children.push(cu);

            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Analysis";
            grp.toolTip = "Analysis of report";
            grp.description = "Analysis of non-conformitiy/potential non-conformity."
            grp.editors = "daniel@barriqueworks.com";
            this.children.push(grp);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Root cause";
            txt.description = "Root couse of problem";
            txt.toolTip = "";
            txt.required = true;
            txt._multiline = true;
            grp.children.push(txt);

            var lst = Object.create(listField);
            lst.ctor();
            lst.displayName = "Type of Action";
            lst.description = "Specify what kind of action is required.";
            lst.toolTip = "Is it Corrective or Preventive?";
            lst.options = "Corrective action;Preventive action;None";
            lst.multiselect = false
            lst.required = true;
            grp.children.push(lst);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Non-conformal to which requirements?";
            txt.description = "Enter requirements that are not fulfilled";
            txt.toolTip = "";
            txt.required = true;
            txt._multiline = false;
            grp.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Action needed";
            txt.description = "Describe how to solve issue and what Follow up steps needs to be made.";
            txt.toolTip = "";
            txt.required = true;
            txt._multiline = true;
            grp.children.push(txt);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Deadline";
            txt.description = "Deadline for solution";
            txt.toolTip = "";
            txt.required = true;
            txt._inputType = "date";
            txt._multiline = false;
            grp.children.push(txt);

            cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.children.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "Quality Manager Signature";
            grp.children.push(cu);

            grp = Object.create(groupField);
            grp.ctor();
            grp.displayName = "Follow Up";
            grp.toolTip = "Actions taken";
            grp.description = "Evidence of actions taken."
            grp.editors = "daniel@barriqueworks.com";
            grp.repeater = true;
            this.children.push(grp);

            txt = Object.create(textField);
            txt.ctor();
            txt.displayName = "Action taken";
            txt.description = "Describe what is done.";
            txt.toolTip = "";
            txt.required = true;
            txt._multiline = true;
            grp.newRowTemplate.push(txt);

            cu = Object.create(currentDateTimeField);
            cu.ctor();
            cu.description = "Date";
            grp.newRowTemplate.push(cu);
            cu = Object.create(currentUserField);
            cu.ctor();
            cu.description = "Employee Signature";
            grp.newRowTemplate.push(cu);

            break;
    }
}
this.ctor = function () {
    this._children = new Array();
    this._allUsersForImpersonation = new Array();
    this.workflow = "";
    this.broadCastRecievers = "initiator";
    this.finalStep = "initiator";
    this.allowLocalCopies = "initiator";
    this.publishTo = userSettings.identitySetting.email;
    if(!this._id)
        this._id = helper.generateGUID();
    this.allowSendOneStepBack = true;
}
this.ctor1 = function () {
    this._children = new Array();
    this._allUsersForImpersonation = new Array();
    this.workflow = "";
    this.broadCastRecievers = "initiator";
    this.finalStep = "initiator";
    this.allowLocalCopies = "initiator";
    this.publishTo = userSettings.identitySetting.email;;
  
    this.allowSendOneStepBack = true;
}
this.regenerateGUID = function () {
    this._id = helper.generateGUID();
}
this.dispose = function () {

}
this.findField = function (idwithprefix) {
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

this.checkSettings = function () {
    // we need to check sytax of following

    // Workflow
    // Broadcast recievers
    // Final step
    // Publish To

    // all properties van have multiple users
    // delimiters are , or ;

    // regexp for email match : ^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$
    // multiple emails could be something like: ^([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\W*[,;]*\W*)+$

    // Workflow property is little bit more complicated     
    // every email represents one step, but, if in brackets, then user can choose one of the emails within brackets when sending to that step
    // for example, let's say Worflow is: user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com); userA@example.com
    // this means that workflow will be user1@example.com -> user2@example.com -> 
    // and the user2@example.com, when sending to next step, will be prompted to choose one of three options (igor@example.com; User3@example.com, User4@example.com).
    // if, user2@example.com chooses igor@example.com, igor@example.com will be aple to send form to userA@example.com
    //
    // Another option is integer after ending bracket, for instance, let's say Worflow is:
    // user1@example.com; user2@example.com; (igor@example.com; User3@example.com, User4@example.com)5; userA@example.com
    // This means that users within 3rd step (igor@example.com; User3@example.com, User4@example.com) can 5 times send the form between
    // themselves, or to next step (prompt will be shown).
    // This is usefull when you don't know how exactly form in that step needs to be resolved (for instace ISO 9001:2015 preventive/corrective action)
    // Sometimes users need to have freedom to choose recipients, but number of sending is limited, so that form will always find it's way
    // to final step.

    var res = checkListSyntax(this.workflow, true);
    if (res.errors) {
        helper.alert("Workflow syntax error: " + res.errors);
        return res.errors;
    }
    else
        this.workflow = res.optimizedString;

    res = checkListSyntax(this.broadCastRecievers);
    if (res.errors) {
        helper.alert("Broadcast recievers syntax error: " + res.errors);
        return res.errors;
    }
    else
        this.broadCastRecievers = res.optimizedString;

    res = checkListSyntax(this.finalStep);
    if (res.errors) {
        helper.alert("Final step syntax error: " + res.errors);
        return res.errors;
    }
    else
        this.finalStep = res.optimizedString;

    res = checkListSyntax(this.publishTo);
    if (res.errors) {
        helper.alert("Publish To syntax error: " + res.errors);
        return res.errors;
    }
    else
        this.publishTo = res.optimizedString;
}
// returns object with two arrays and error string:
// optimizedString - string with unified delimiters and spaces
// userList - array of user emails, or arrays (in case isAdvanced is true, used for workflow)
// errors - error description, if any
function checkListSyntax(listString, isAdvanced) {
    //let's cjheck for allowed characters
    var error = checkCharacters(listString);
    if (error)
        return { optimizedString: null, userList: null, errors: error }
    //let's check for brackets if they are not allowed
    if (!isAdvanced && (listString.indexOf("(") > -1 || listString.indexOf(")") > -1))
        return { optimizedString: null, userList: null, errors: "Brackets () are not allowed for this type, only for Workflow." }

    //    
    var ret = { optimizedString: "", userList: new Array(), errors: "" };
    if (listString.trim() == "")
        return ret;
    var elements = listString.split(/[,;]/gi);
    var depth = 0;
    var current = null;
    for (var i in elements) {
        var endbracket = false;
        var startbracket = false;
        current = ret.userList;
        var s = new String();

        // trim, lowercase, remove inner spaces...
        var mail = elements[i].trim().toLowerCase().replace(/ /gi, '');
        //bracket start
        if (mail.startsWith("(")) {
            depth++;
            startbracket = true;
            current = new Array();
            ret.userList.push(current);
        }
        //bracket end
        if (mail.indexOf(")") > -1) {
            endbracket = true;

            //is there an integer at the end?
            if (!mail.endsWith(")")) {
                //there's something at the end
                var counter = mail.substr(mail.indexOf(")") + 1);
                if (isNaN(counter)) {
                    ret.errors = "Counter parameter for group seems to be invalid integer.";
                    return ret;
                }

                current.counter = Math.abs(counter);

                if (counter < 0) {
                    ret.errors = "Counter parameter for group must be zero or greater.";
                    return ret;
                }
                mail = mail.substr(0, mail.indexOf(")"));
            }
            else
                current.counter = 0;
        }
        //remove brackets so we get valid email    
        mail = mail.replace("(", "").replace(")", "").replace(";", "").replace(",", "");

        //is mail valid?
        if (!mail.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/gi)) {
            if (mail != "initiator") {
                ret.errors = "Email " + mail + " seems to be invalid.";
                return ret;
            }
        }
        else {
            var a = new Array();
            a.find
            if (!userSettings.userList.find(function (m) {

                return m.toLowerCase() == mail;

            })) {
                helper.log("Warning: User <strong>" + mail + "</strong> not found in Profiles. Check for typing error.");
            }
        }
        current.push(mail);
        ret.optimizedString += (startbracket ? ";(" : " ") + mail + (endbracket ? ")" + current.counter + ";" : " ");
        ret.optimizedString = ret.optimizedString.replace("  ", ";");
        //bracket end
        if (endbracket) {
            depth--;
            current = ret.userList;
        }
    }
    if (depth != 0)
        ret.errors = "Brackets problem. " +
            (depth < 0 ? "To many closed (" + depth + ") but not opened" : "To many opened (" + depth + ") but not closed");

    ret.optimizedString = ret.optimizedString.trim();
    ret.optimizedString = ret.optimizedString.replace(/;/gi, "; ");
    ret.optimizedString = ret.optimizedString.replace(/ ; \(/gi, "; (");
    //   ret.optimizedString = ret.optimizedString.replace(/ ; \)/gi, ");");
    ret.optimizedString = ret.optimizedString.replace(/  /gi, " ");

    ret.optimizedString = ret.optimizedString.trim();
    return ret;
}
// returns error string if problems found
function checkCharacters(listString) {
    if (listString == null)
        return;
    if (listString.length == 0)
        return;
    if (
        !listString.match(/[0-9A-Za-z_\-\.@,;()\W]/gi))
        return "Character not allowed. Only nubers, letters, semicolon, comma, minus(-), underscore, brackets(for workflow) and at symbol (@) are allowed";

}

/* Form load  */
this.openForm = function (jsonstring, loadedFrom) {
    
        var loadedObj = JSON.parse(jsonstring);
    
        console.log("Reconstructing objects from loaded JSON.");
        var cnt = 0;
        for (var attrname in loadedObj) {
           // console.log("attrname = " + attrname);
    
            if (attrname == "_children")
                loadChildren(this, loadedObj[attrname], attrname);
            else
                this[attrname] = loadedObj[attrname];
            cnt++;
        }
        if(loadedFrom)
            this.filename=loadedFrom;
        // we need to change id to avoid conflicts if the same form is already oened in editor.
        //this.currentForm.regenerateGUID();
        console.log("Done reconstructing objects from loaded JSON.");
        return true;
    }
    
    function loadChildren(parent, obj, aname, sec) {
        console.log("loadChildren(" + parent + ", " + obj + ", " + aname + ")");
    
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
    
            if (aname == "_children") {
                parent._children.push(field);
             //   console.log("added to _children");
            }
            if (aname == "_dataRows") {
                parent._dataRows[parent._dataRows.length - 1].push(field);
            //    console.log("added to _dataRows [" + parent._dataRows.length - 1 + "]");
            }
            if (aname == "_newRowTemplate") {
                parent._newRowTemplate.push(field);
              //  console.log("added to _newRowTemplate");
            }
            for (var arrayEl in obj) {
    
                if (arrayEl == "_children" || arrayEl == "_dataRows" || arrayEl == "_newRowTemplate") {
                    loadChildren(field, obj[arrayEl], arrayEl, false);
                }
                else {
                    field[arrayEl] = obj[arrayEl];
                 //   console.log("copy " + arrayEl)
                }
            }
        }
        else {
            // its an array
            for (var arrayEl in obj) {
    
                if (aname == "_dataRows" && !sec) {
                    parent._dataRows.push(new Array());
                    // dataRowsCounter ++;
                    loadChildren(parent, obj[arrayEl], aname, true);
    
                }
                else
                    loadChildren(parent, obj[arrayEl], aname);
            }
        }
    
        return;
    }