var form = require("./objectmodel/form.js");
const ipc = require('electron').ipcRenderer;
const json2csv = require('json2csv');

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
}
this.refreshBroadcastDB = function () {
    var forms_ = helper.getFilesInDir(helper.getRecievedBroadCastsPath());
    var parsedForms = new Array();
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
        pageSize: 6,
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
}

this.db = db;
this.sentDB = sentDB;
this.broadcastDB = broadcastDB;

$(document).ready(
    function () {
        dataCollection.refreshDB();
        dataCollection.refreshBroadcastDB();
    }
);

this.displayFormModal = function (path) {
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
            "Close Form": function () {

                $(this).dialog("close");
            }
        }
    });

    this.currentForm = Object.create(form);
    this.currentForm.ctor();
    var loadedObj = helper.loadFile(path);
    this.currentForm.openForm(loadedObj, path)

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

    var parsedForms = new Array();
    dataCollection.fields = ['_id', 'formid', '_name', "_version", "_displayName", "_value"];
    dataCollection.fieldNames = ['Form Type', 'Form ID', 'Form Name', "Version", "Title", "Value"];

    for (var i in forms_) {
        var path = helper.join(folder, forms_[i]);
        var loadedObj = JSON.parse(helper.loadFile(path));
        // we use custom flatten function instaed of flatten options in json2csv
        parsedForms.push(dataCollection.flatten(loadedObj));
        //     parsedForms.push(loadedObj);
    }


    var opts = {
        data: parsedForms,
        del: ";"
        //,flatten: true,
        //fields: dataCollection.fields,
        //fieldNames: dataCollection.fieldNames,
    };
    var csv = json2csv(opts);
    ipc.send("exportCSV", csv);

}

this.flatten = function (o) {
    var prefix = arguments[1] || "", out = arguments[2] || {}, name;
    for (name in o) {
        if (o.hasOwnProperty(name)) {

            if (typeof o[name] === "object") {
                dataCollection.flatten(o[name], prefix + (name === "_children" ? "X" : name) + '.', out)
            }
            else {
                var index = dataCollection.fields.indexOf(name);
                if (index > -1) {
                    if (prefix) {
                        if (name != "_id") {
                            out[prefix + dataCollection.fieldNames[index]] = o[name];
                        }
                    }
                    else {
                        out[prefix + dataCollection.fieldNames[index]] = o[name];
                    }

                }
            }

        }
    }
    return out;
}

