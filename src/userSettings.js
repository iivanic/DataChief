
var helper = require("./objectmodel/utils.js");

this.userList = new Array();

this.ctor = function() {
    this.filePath = helper.getUserSettingsFilePath();
    console.log("UserSettings=" + this.filePath);
    this.mainEmail = helper.getCurrentUsername();
    this.Identities = helper.getDirectories(helper.getUserFolder());
    this.email = "";

    this.organization = "";

    this.useSingleAccount = true;
    this.takeOnlyOne = true;

    this.userList = new Array();
  

    var file = "";
    try {
        file = helper.decrypt(helper.loadFile(this.filePath));
    } catch (ex)
    { }
    if (!file) {
        // first time creation
        this.email = helper.getCurrentUsername();
        this.userList.push(this.email);
        this.userList.push("initiator");
        helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));
    }
    else {
        var loadedObj = JSON.parse(file);
        for (var attrname in loadedObj) {
            this[attrname] = loadedObj[attrname];
        }
    }

}
this.save = function() {
    helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));
}
this.toGui = function() {

    $("#textSettingsOrganization").val(this.organization);



    $("#checkboxSettingsSingleAccount").prop("checked", this.useSingleAccount);
    $("#checkboxSettingsTakeOnlyOne").prop("checked", this.takeOnlyOne);


    userSettings.singleAccountToggle();

    $("#resettings").button();
    $("#savesettings").button();


    $("#editOrgMemberShowPassword").button(
        { icons: {
            secondary: "ui-icon-notice"
        }
 
    }).click(
         function() {
            if ($("#editOrgMemberSecret").prop("type") == "password")
                $("#editOrgMemberSecret").prop("type", "text");
            else
                $("#editOrgMemberSecret").prop("type", "password");

        }
    ) ;
    $("#addOrgMember").button().click(
        function() {
            addOrgMember();
        }
    );


}
function addOrgMember() {
    var newFormDialog = $("#editOrgMember").dialog({
        autoOpen: true,
        modal: true,
        width: "470",
        height: "440",

        buttons: {
            "Save user": function() {
                addTab(false, "");
                $(this).dialog("close");
            },
            Cancel: function() {
                $("#editOrgMemberEmail").val("");
                $("#editOrgMemberName").val("");
                $("#editOrgMemberSecret").val("");
                $("#editOrgMemberSecret1").val("");
                $(this).dialog("close");
            }
        },
        close: function() {

        }
    });
}
this.fromGui = function() {
 
    this.organization = $("#textSettingsOrganization").val();
 

 
    this.useSingleAccount = $("#checkboxSettingsSingleAccount").is(':checked');
    this.takeOnlyOne = $("#checkboxSettingsTakeOnlyOne").is(':checked');
 

}
this.singleAccountToggle = function() {
    if ($("#checkboxSettingsSingleAccount").is(':checked'))
        $("#SMTPSettings").attr('disabled', 'disabled');
    else
        $("#SMTPSettings").removeAttr('disabled');


}
