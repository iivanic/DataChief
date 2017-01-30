


this.ctor = function (email) {
    this.filePath = helper.getIdentitySettingsFilePath(email);
    console.log("IdentitySettings('" + email + "') =" + this.filePath);

    //we need this to know weather we can delete this IdentitySetting 
    //when removing BarriqueWroks Case Study users
    this.caseStudyAutomaticallyAdded = false;
    this.email = email;
    this.oldEmail = email;
    this.name = "";
    this.userSecret = "";
    this.organization = "";
    this.comment = "";

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

    var file = "";
    try {
        file = helper.decrypt(helper.loadFile(this.filePath));
    } catch (ex)
    { }
    if (!file) {
        // first time creation
        if (!this.email)
            this.email = helper.getCurrentUsername();
        if (!this.name)
            this.name = helper.getCurrentUsername().split("@")[0];
        this.imapUserName = this.email;
        helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));
    }
    else {
        var loadedObj = JSON.parse(file);
        for (var attrname in loadedObj) {
            this[attrname] = loadedObj[attrname]
        }
    }

}
this.save = function () {
    if(this.oldEmail!=this.email)
    {
        //email has changed, we need to chreate new file;
        var oldFolder = helper.getIdentityFolder(this.oldEmail) ;
        this.filePath = helper.getIdentitySettingsFilePath(this.email);
        this.oldEmail = this.email;
        // delete old file ??? 
        helper.deleteFolder(oldFolder);
    }
    helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));
    helper.log("Profile " + this.email + " saved.");
}
this.toGui = function () {
    $("#textSettingsEmail").val(this.email);
    $("#textSettingsName").val(this.name);

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

    $("#textSettingsUSerSecret").val(this.userSecret);
    $("#textSettingsUSerSecret1").val(this.userSecret);
    $("#textSettingsNameComment").val(this.comment);




}



this.fromGui = function () {
    this.email = $("#textSettingsEmail").val();
    this.name = $("#textSettingsName").val();
    this.imapUserName = $("#textSettingsIMAPUsername").val();
    this.imapPassword = $("#textSettingsIMAPPassword").val();
    this.imapServer = $("#textSettingsIMAPServer").val();
    this.imapPort = $("#textSettingsIMAPServerPort").val();
    //  helper.log(" textSettingsIMAPServerPort" +  $("#textSettingsIMAPServerPort").val() + "," + this.imapPort + this.name) ;
    this.imapRequiresSSL = $("#textSettingsIMAPRequiresSSL").is(':checked');

    this.smtpUserName = $("#textSettingsSMTPUsername").val();
    this.smtpPassword = $("#textSettingsSMTPPassword").val();
    this.smtpServer = $("#textSettingsSMTPServer").val();
    this.smtpPort = $("#textSettingsSMTPServerPort").val();
    this.smtpRequiresSSL = $("#textSettingsSMTPRequiresSSL").is(':checked');
    this.RequiresAuthentication = $("#textSettingsSMTPRequiresAuthentication").is(':checked');
    this.userSecret = $("#textSettingsUSerSecret").val();
    this.comment = $("#textSettingsNameComment").val();


}
