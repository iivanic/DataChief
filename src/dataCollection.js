
var form = require("./objectmodel/form.js");
const ipc = require('electron').ipcRenderer;
const json2csv = require('json2csv');

var broadCastedFormTypes;

var broadcastDB = {

    loadData: function (filter) {
        return $.grep(this.forms, function (form) {
            return (!filter.Name || form.Name.indexOf(filter.Name) > -1)
                && (!(filter.Version || filter.Version == 0) || form.Version == filter.Version)
                && (!filter["Form type"] || formr["Form type"].indexOf(filter.Type) > -1)
                && (!filter.Initiator || form.Initiator.indexOf(filter.Initiator) > -1)
                && (!filter["Recieved from"] || form["Recieved from"].indexOf(filter["Recieved from"]) > -1)
                && (!filter["Recieved time"] || form["Recieved time"].toString().indexOf(filter["Recieved time"]) > -1)
                && (!filter["Initiation time"] || form["Initiation time"].toString().indexOf(filter["Initiation time"]) > -1)

                ;
        });
    },

    insertItem: function (insertingForm) {
        this.forms.push(insertingForm);
    },

    updateItem: function (updatingForm) { },

    deleteItem: function (deletingForm) {
        var formIndex = $.inArray(deletingForm, this.forms);
        this.forms.splice(formIndex, 1);
    }

};

var sentDB = {

    loadData: function (filter) {
        return $.grep(this.forms, function (form) {
            return (!filter.Name || form.Name.indexOf(filter.Name) > -1)
                && (!(filter.Version || filter.Version == 0) || form.Version == filter.Version)
                && (!filter.Type || form.Type.indexOf(filter.Type) > -1)
                && (!filter.Reciever || form.Reciever.indexOf(filter.Reciever) > -1)
                && (!filter["Sent time"] || form["Sent time"].toString().indexOf(filter["Sent time"]) > -1)
                && (!filter["Workflow step"] || form["Workflow step"].indexOf(filter["Workflow step"]) > -1)
                ;
        });
    },

    insertItem: function (insertingForm) {
        this.forms.push(insertingForm);
    },

    updateItem: function (updatingForm) { },

    deleteItem: function (deletingForm) {
        var formIndex = $.inArray(deletingForm, this.forms);
        this.forms.splice(formIndex, 1);
    }

};

var db = {

    loadData: function (filter) {
        return $.grep(this.forms, function (form) {
            return (!filter.Name || form.Name.indexOf(filter.Name) > -1)
                && (!(filter.Version || filter.Version == 0) || form.Version == filter.Version)
                && (!filter["Form type"] || formr["Form type"].indexOf(filter.Type) > -1)
                && (!filter.Initiator || form.Initiator.indexOf(filter.Initiator) > -1)
                && (!filter["Recieved from"] || form["Recieved from"].indexOf(filter["Recieved from"]) > -1)
                && (!filter["Recieved time"] || form["Recieved time"].toString().indexOf(filter["Recieved time"]) > -1)
                && (!filter["Initiation time"] || form["Initiation time"].toString().indexOf(filter["Initiation time"]) > -1)

                ;
        });
    },

    insertItem: function (insertingForm) {
        this.forms.push(insertingForm);
    },

    updateItem: function (updatingForm) { },

    deleteItem: function (deletingForm) {
        var formIndex = $.inArray(deletingForm, this.forms);
        this.forms.splice(formIndex, 1);
    }

};


this.refreshDB = function () {
    var forms_ = helper.getFilesInDir(helper.getDataBasePath());
    var parsedForms = new Array();
    for (var i in forms_) {
        var path = helper.join(helper.getDataBasePath(), forms_[i]);
        // parse
        var parts = forms_[i].split("..");
        var p = parts[0].split("_");
        var p1 = parts[3].split("_");
        parsedForms.push(

            {
                "Path": path,
                "Form Type": p[0],
                "Version": p[1],
                "Name": p[2],
                "Initiator": parts[1],
                "Initiation time": helper.parseDateFromFileName(p1[0]),
                "Recieved from": parts[2],
                "Recieved time": helper.parseDateFromFileName(p1[1]),
                "Workflow step": p1[2]
            }
        );
    }

    db.forms = parsedForms;

    $("#jsGridCollectedData").jsGrid({
        width: "100%",
        //   height: "400px",

        filtering: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 7,
        pageButtonCount: 5,
        autoload: true,
        controller: db,
        rowClick: function (args) {
            dataCollection.displayFormModal(args.item.Path);
        },
        fields: [
            { name: "Path", type: "text", visible: false },
            { name: "Form Type", type: "text", width: 150, visible: false },
            { name: "Version", type: "number", width: 30 },
            { name: "Name", type: "text", width: 200 },
            { name: "Initiator", type: "text", width: 150 },
            { name: "Initiation time", type: "text", width: 100 },
            { name: "Recieved from", type: "text", width: 150 },
            { name: "Recieved time", type: "text", width: 100 },
            { name: "Workflow step", type: "text", visible: false }

        ]
    });
}
this.refreshSentDB = function () {
    var forms_ = helper.getFilesInDir(helper.getSentPath());
    var parsedForms = new Array();

    for (var i in forms_) {
        var path = helper.join(helper.getSentPath(), forms_[i]);
        // parse
        var parts = forms_[i].split("..");
        var p = parts[0].split("_");
        var p1 = parts[2].split("_");
        parsedForms.push(

            {
                "Path": path,
                "Type": p[0],
                "Form Type": p[1],
                "Version": p[2],
                "Name": p[3],
                "Reciever": parts[1],
                "Sent time": helper.parseDateFromFileName(p1[0]),
                "Workflow step": p1[1]
            }
        );
    }

    sentDB.forms = parsedForms;

    $("#jsGridSentData").jsGrid({
        width: "100%",
        //   height: "400px",

        filtering: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 7,
        pageButtonCount: 5,
        autoload: true,
        controller: sentDB,
        rowClick: function (args) {
            dataCollection.displayFormModal(args.item.Path);
        },
        fields: [
            { name: "Path", type: "text", visible: false },
            { name: "Type", type: "text", width: 50 },
            { name: "Form Type", type: "text", width: 150, visible: false },
            { name: "Version", type: "number", width: 30 },
            { name: "Name", type: "text", width: 200 },
            { name: "Reciever", type: "text", width: 100 },
            { name: "Sent time", type: "text", width: 100 },
            { name: "Workflow step", type: "text", width: 30 }

        ]
    });
    $($("#jsGridSentData .jsgrid-filter-row input")[0]).val("WORKFLOW");
    $("#jsGridSentData").jsGrid("search", { Type: "WORKFLOW" }).done(function () { });

}
this.refreshBroadcastDB = function () {
    broadCastedFormTypes = new Object();
    var forms__ = helper.getFilesInDir(helper.getRecievedBroadCastsPath());
    var parsedForms = new Array();
    var forms_ = new Array();
    // in broadcast sghow only last version od form (with max hitory length)
    var maxHistory = new Array();
    var maxHistoryFile = new Array();

    for (var i in forms__) {
        var form = helper.loadFile(helper.join(helper.getRecievedBroadCastsPath(), forms__[i]));
        form = JSON.parse(form);
        if (form.history) {
            if (form.formid) {
                if (!maxHistory[form.formid + "_" + form._version]) {
                    maxHistory[form.formid + "_" + form._version] = form.history.length;
                }
                if (form.history.length > maxHistory[form.formid + "_" + form._version]) {

                    maxHistory[form.formid + "_" + form._version] = form.history.length;
                    maxHistoryFile[form.formid + "_" + form._version] = forms__[i];
                }
            }
            else
                forms_.push(forms__[i]);
        }
    }
    for (var i in maxHistoryFile) {
        forms_.push(maxHistoryFile[i]);
    }

    for (var i in forms_) {
        var path = helper.join(helper.getRecievedBroadCastsPath(), forms_[i]);

        // parse
        var parts = forms_[i].split("..");
        var p = parts[0].split("_");
        var p1 = parts[3].split("_");
        parsedForms.push(
            {
                "Path": path,
                "Form Type": p[0],
                "Version": p[1],
                "Name": p[2],
                "Initiator": parts[1],
                "Initiation time": helper.parseDateFromFileName(p1[0]),
                "Recieved from": parts[2],
                "Recieved time": helper.parseDateFromFileName(p1[1]),
                "Workflow step": p1[2]
            }
        );
        broadCastedFormTypes[p[0]] = p[2];
    }
    broadcastDB.forms = parsedForms;

    $("#jsGridRecievedBroadcastsData").jsGrid({
        width: "100%",
        //   height: "400px",

        filtering: true,
        inserting: false,
        editing: false,
        sorting: true,
        paging: true,
        pageSize: 5,
        pageButtonCount: 5,
        autoload: true,
        controller: broadcastDB,
        rowClick: function (args) {
            dataCollection.displayFormModal(args.item.Path);
        },
        fields: [
            { name: "Path", type: "text", visible: false },
            { name: "Form Type", type: "text", width: 150, visible: false },
            { name: "Version", type: "number", width: 30 },
            { name: "Name", type: "text", width: 200 },
            { name: "Initiator", type: "text", width: 150 },
            { name: "Initiation time", type: "text", width: 100 },
            { name: "Recieved from", type: "text", width: 150 },
            { name: "Recieved time", type: "text", width: 100 },
            { name: "Workflow step", type: "text", visible: false }

        ]
    });
    var selectHTML = "<option value=''><-- Choose --></option>";
    for (var i in broadCastedFormTypes) {
        selectHTML += "<option value='" + i + "'>" + broadCastedFormTypes[i] + "</option>";
    }
    $("#selectCollectorChooseForm").html(selectHTML);
    $("#selectCollectorChooseForm").selectmenu({
        change: function (event, ui) {
            if ($("#selectCollectorChooseForm").val() != '')
                dataCollection.selectForm($("#selectCollectorChooseForm").val());

        }
    });
    $("#selectCollectorChooseForm").selectmenu("refresh");
}

this.db = db;
this.sentDB = sentDB;
this.broadcastDB = broadcastDB;

$(document).ready(
    function () {
        dataCollection.refreshDB();
        dataCollection.refreshBroadcastDB();
        dataCollection.refreshSentDB();
        mermaid.mermaidAPI.initialize(mermaidconfig);

    }
);
this.currentModelDiaplyedForm = null;
this.showHistory = function () {
    var html = "<table class='table'>\n<tr>\n<th>Action</th>\n<th>Time</th>\n<th>From</th>\n<th>To</th>\n<th>From step</th>\n<th>To Step</th>\n</tr>\n";
    for (var i in dataCollection.currentModelDiaplyedForm.history) {
        if (!(dataCollection.currentModelDiaplyedForm.history[i].action == "Publish" &&
            (dataCollection.currentModelDiaplyedForm.history[i].to != userSettings.identitySetting.email &&
                dataCollection.currentModelDiaplyedForm.history[i].from != userSettings.identitySetting.email))) {
            html += "<tr>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].action + "</td>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].time + "</td>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].from + "</td>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].to + "</td>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].fromStep + "</td>\n";
            html += "<td>\n" + dataCollection.currentModelDiaplyedForm.history[i].step + "</td>\n";
            html += "</tr>\n";
        }
    }
    html += "</table>\n";
    helper.alert(html, null, true, 900, 650);
}

this.displayFormModal = function (path) {
    this.currentForm = Object.create(form);
    this.currentForm.ctor();
    var loadedObj = helper.loadFile(path);
    this.currentForm.openForm(loadedObj, path)
    this.currentModelDiaplyedForm = this.currentForm;
    //  
    $("#dialog-modal-form").dialog({
        resizable: false,
        height: $(window).outerHeight(),
        width: "100%",
        modal: true,
        buttons: {
            "PDF": function () {
                sendCommandToWorker($("#dialog-modal-form-placeholder").html());

            },
            "Show history": function () {
                dataCollection.showHistory();

            },
            "Close Form": function () {

                $(this).dialog("close");
            }
        }
    });




    this.currentForm.render($("#dialog-modal-form-placeholder"), false, "", "dialog-modal-form-placeholder_prefix");



}
this.exportDB = function () {

    this.export(helper.getFilesInDir(helper.getDataBasePath()), helper.getDataBasePath());

}
this.exportSentDB = function () {

    this.export(helper.getFilesInDir(helper.getSentPath()), helper.getSentPath());
}
this.exportBroadcastDB = function () {

    this.export(helper.getFilesInDir(helper.getRecievedBroadCastsPath()), helper.getRecievedBroadCastsPath());

}

this.export = function (forms_, folder) {
    //
    //Problem is that order of columns in CSV file is not garanteed
    //
    if (forms_.length < 1) {
        helper.alert("No Forms to export.")
        return;
    }
    $("#exportDialog").dialog({
        resizable: false,
        height: 380,
        width: 950,
        modal: true,
        buttons: {

            Cancel: function () {
                $(this).dialog("close");

            },
            Ok: function () {
                $(this).dialog("close");
                var val = $('input[name=exportStyle]:checked').val();
                if (val == 0) {
                    var parsedForms = new Array();
                    dataCollection.list = new Array();
                    dataCollection.fieldNames = ['Form Type', 'Form Name', 'Form ID', "Form Version", "Path", "Title", "Data Type", "Value"];

                    for (var i in forms_) {
                        var path = helper.join(folder, forms_[i]);
                        var loadedObj = JSON.parse(helper.loadFile(path));
                        // we use custom flatten function instaed of flatten options in json2csv
                        parsedForms.push(loadedObj);
                        //     parsedForms.push(loadedObj);
                    }
                    //header
                    dataCollection.list.push(dataCollection.fieldNames)

                    for (var i in parsedForms) {



                        //['_id', 'formid', '_name', "_version", "_displayName", "_value"];

                        //     for (var j in parsedForms[i]) {


                        dataCollection.read(parsedForms[i], '>Form', parsedForms[i]);



                    }
                    //  var csv = json2csv(opts);
                    var csv = require("./csv.js").convertFromArray(dataCollection.list)

                    ipc.send("exportCSV", csv);
                }
                else
                    helper.alert("Not yet done.");
            }
        }
    });
    return;




}

this.read = function (o, prefix, form) {
    var name;
    var last = "";
    for (name in o) {
        if (o.hasOwnProperty(name)) {

            if (o["_type"] == "groupField")
                last = ">" + o["_displayName"];
            if (typeof o[name] === "object") {

                dataCollection.read(o[name], prefix + last, form);
            }
            else {
                if (name == "_value") {

                    var row = new Array();
                    row.push(form["_id"]);
                    row.push(form["_name"]);
                    if (form["formid"])
                        row.push(form["formid"]);
                    else
                        row.push("None");
                    row.push(form["_version"]);
                    row.push(prefix);
                    row.push(o["_displayName"]);
                    row.push(o["_type"]);
                    row.push(o[name]);
                    dataCollection.list.push(row);

                }
            }
        }

    }
}
var mermaidconfig = {
    startOnLoad: true,
    theme: 'forest',

    flowchart: {
        useMaxWidth: true,
        htmlLabels: true
    }
};
this.selectForm = function (formType) {
    var connectorStr = "-->";

    helper.log(formType + " form chosen for analysis.")

    var fileList = helper.getFilesInDir(helper.getRecievedBroadCastsPath())
    var form = "";
    var forms = new Array();
    var maxforms
    for (var i in fileList) {
        if (fileList[i].substring(0, formType.length) == formType) {
            var form = helper.loadFile(helper.join(helper.getRecievedBroadCastsPath(), fileList[i]));
            form = JSON.parse(form);
            if (!forms[form.formid])
                forms[form.formid] = form
            if (forms[form.formid].history.length < form.history.length)
                forms[form.formid] = form
        }
    }
    //now in forms we have latest steps
    var flow = new Array();
    for (var i in forms) {

        for (var j in forms[i].history) {
            var skip = false;
            s = forms[i].history[j];
            if (s.action == "Publish" || s.action == "Broadcast") {
                //  if (s.to != forms[i].initiator)
                skip = true;;
            }
            if (!skip) {
                if (!flow[mailToMM(s.from, s.fromStep)]) {
                    flow[mailToMM(s.from, s.fromStep)] = new Array();
                }
                flow[mailToMM(s.from, s.fromStep)].push(s);
            }
        }
    }
    // now we have nice structure for drawing

    var publishedTo = form.publishTo.replace(/,/gi, ";").split(/;/gi);
    var markup =
        "graph TD\n" +
        mailToMM(form._author, 99999) + "[\" Form " + form._name + " ( " + formType + " ), ver " + form._version + " created by " + form._author + " \n" +
        "on behalf of " + form.publisher + "\"] ";

    for (var i in publishedTo) {
        markup += "-->|Published| " + mailToMM(publishedTo[i], 0) + "(\"" + publishedTo[i] + "\")\n";
        if (i < publishedTo.length - 1)
            markup += mailToMM(form._author, 99999);

    }
    markup += "style " + mailToMM(form._author, 99999) + " fill:#d9f9d9,stroke:#333,stroke-width:2px\n";

    var wf = helper.parseWorkFlow(form.workflow);

    var lastWF = null;
    var lastWFIndex = 0;
    for (var j in wf) {
        lastWF = wf[j];
        lastWFIndex = j;
        if (wf[j] instanceof Array) {
            //ako je array, onda moramo dodati više...
        }
        else {
            lastWF = mailToMM(lastWF, parseInt(j) + 1);

            markup += lastWF + "(\"" + wf[j] + "\")\n";

            markup += "style " + lastWF + " fill:#d9d9d9,stroke:#333,stroke-width:1px\n"
        }
    }

    //final step
    var finalStep = form.finalStep.replace(/,/gi, ";").split(/;/gi);
    for (var j in finalStep) {
        markup += mailToMM(finalStep[j], wf.length + 1) + "(\"" + finalStep[j] + "\")\n";
        markup += "style " + mailToMM(finalStep[j], wf.length + 1) + " fill:#f9d9d9,stroke:#333,stroke-width:2px\n"
        //conect it with last WF
        if (lastWF instanceof Array) {
            //ako je array, onda moramo dodati više...
        }
        else {

        }
    }
    var counter = new Array();
    //connectors
    for (var i in flow) {
        for (var j in flow[i]) {
            if (!counter[i + "-->" + mailToMM(flow[i][j].to, flow[i][j].step)])
                counter[i + "-->" + mailToMM(flow[i][j].to, flow[i][j].step)] = 0;

            counter[i + "-->" + mailToMM(flow[i][j].to, flow[i][j].step)] = counter[i + "-->" + mailToMM(flow[i][j].to, flow[i][j].step)] + 1;
        }
    }
    for (var i in counter) {
        markup += i.replace("-->", "-->|" + counter[i].toString() + "| ") + "\n";
    }


    console.log(markup);
    dataCollection.setGraph4Mermaide(markup);

}
function mailToMM(email, step) {
    return email.replace('@', '_AT_') + "_" + step;

}
function countSendersAtStep(sender, step, formtype, version) {
    var ret = 0;
    //analyze broadcast DB
    var forms_ = helper.getFilesInDir(helper.getRecievedBroadCastsPath());
    var parsedForms = new Array();
    for (var i in forms_) {
        var path = helper.join(helper.getRecievedBroadCastsPath(), forms_[i]);
        // parse
        var parts = forms_[i].split("..");
        var p = parts[0].split("_");
        var p1 = parts[3].split("_");
        // ---
        var _Path = path;
        var _FormType = p[0];
        var _Version = p[1];
        var _Name = p[2];
        var _Initiator = parts[1];
        var _Initiationtime = helper.parseDateFromFileName(p1[0]);
        var _Recievedfrom = parts[2];
        var _Recievedtime = helper.parseDateFromFileName(p1[1]);
        var _Workflowstep = p1[2];

        if (formtype == _FormType && version == _Version && step == _Workflowstep && sender == _Recievedfrom) {
            ret++;
        }
    }
    return ret;
}


this.setGraph4Mermaide = function (graphDefinition) {


    $("#svgGraph").remove();
    var graph = mermaid.mermaidAPI.render('svgGraph', graphDefinition);
    $("#graphDiv").html(graph);

}

