//const ipcRenderer = require('electron').ipcRenderer;

var helper = require("./objectmodel/utils.js");
this.email = "";
this.name = "";
this.organization = "";


this.userList = new Array();
this.filePath = "";

this.ctor = function() {
    this.filePath = helper.getUserSettingsFilePath();
    console.log("userfile=" + this.filePath);
    this.email = "";
    this.name = "";
    this.organization = "";

    this.imapUserName = "";
    this.imapPassword = "";
    this.imapServer = "imap.gmail.com";
    this.imapPort = "993";
    this.imapRequiresSSL = true;

    this.smtpUserName = "";
    this.smtpPassword = "";
    this.smtpServer = "smtp.gmail.com";
    this.smtpPort = "465";
    this.smtpRequiresSSL = true;
    this.RequiresAuthentication = true;

    this.useSingleAccount = true;
    this.takeOnlyOne = true;

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
this.save = function() {
    helper.saveTextFile(this.filePath, JSON.stringify(this, null, 5));
}
this.toGui = function() {
    $("#textSettingsEmail").val(this.email);
    $("#textSettingsName").val(this.name);
    $("#textSettingsOrganization").val(this.organization);

    $("#textSettingsIMAPUsername").val(this.imapUserName);
    $("#textSettingsIMAPPassword").val(this.imapPassword);
    $("#textSettingsIMAPServer").val(this.imapServer);
    $("#textSettingsIMAPServerPort").val(this.imapPort);
    $("#textSettingsIMAPRequiresSSL").prop("checked", this.imapRequiresSSL);

    $("#textSettingsSMTPUsername").val(this.smtpUserName);
    $("#textSettingsSMTPPassword").val(this.smtpPassword);
    $("#textSettingsSMTPServer").val(this.smtpServer);
    $("#textSettingsSMTPServerPort").val(this.smtpPort);
    $("#textSettingsSMTPRequiresSSL").prop("checked", this.smtpRequiresSSL);
    $("#textSettingsSMTPRequiresAuthentication").prop("checked", (this.RequiresAuthentication));

    $("#checkboxSettingsSingleAccount").prop("checked", this.useSingleAccount);
    $("#checkboxSettingsTakeOnlyOne").prop("checked", this.takeOnlyOne);;

}
this.fromGui = function() {
    this.email = $("#textSettingsEmail").val();
    this.name = $("#textSettingsName").val();
    this.organization = $("#textSettingsOrganization").val();
    this.imapUserName = $("#textSettingsIMAPUsername").val();
    this.imapPassword = $("#textSettingsIMAPPassword").val();
    this.imapServer = $("#textSettingsIMAPServer").val();
    this.imapPort = $("#textSettingsIMAPServerPort").val();
    this.imapRequiresSSL = $("#textSettingsIMAPRequiresSSL").is(':checked');

    this.smtpUserName = $("#textSettingsSMTPUsername").val();
    this.smtpPassword = $("#textSettingsSMTPPassword").val();
    this.smtpServer = $("#textSettingsSMTPServer").val();
    this.smtpPort = $("#textSettingsSMTPServerPort").val();
    this.smtpRequiresSSL = $("#textSettingsSMTPRequiresSSL").is(':checked');
    this.RequiresAuthentication = $("#textSettingsSMTPRequiresAuthentication").is(':checked');
    this.useSingleAccount = $("#checkboxSettingsSingleAccount").is(':checked');
    this.takeOnlyOne = $("#checkboxSettingsTakeOnlyOne").is(':checked');

}
