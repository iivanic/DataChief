const ipcRenderer = require('electron').ipcRenderer;

var helper = require("./objectmodel/utils.js");
this.email = "";
this.name = "";
this.organization = "";
this.userList = new Array();
this.filePath = "";

this.ctor = function () {
    this.filePath = helper.getUserSettingsFilePath();
    console.log("userfile=" + this.filePath);
    this.email = "";
    this.name = "";
    this.organization = "";
    this.userList = new Array();
    var file = "";
    try {
        file = helper.loadFile(this.filePath)
    } catch (ex)
    { }
    if (!file) {
        // first time creation
        this.email = helper.getCurrentUsername();
        this.userList.push(this.email);
        this.userList.push("initiator");
        helper.saveTextFile(this.filePath, JSON.stringify(this, null, 5));
    }
    else {
        var loadedObj = JSON.parse(file);
        for (var attrname in loadedObj) {
            this[attrname] = loadedObj[attrname];
        }
    }

}
this.save = function () {
    helper.saveTextFile(this.filePath, JSON.stringify(this, null, 5));
}
this.toGui = function () {
    $("#textSettingsEmail").val(this.email);
    $("#textSettingsName").val(this.name);
    $("#textSettingsOrganization").val(this.organization);
}
this.fromGui = function () {
    this.email=$("#textSettingsEmail").val();
    this.name=$("#textSettingsName").val();
    this.organization=$("#textSettingsOrganization").val();
}
