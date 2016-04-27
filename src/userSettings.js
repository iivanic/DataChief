
var helper = require("./objectmodel/utils.js");
var identitySetting = require("./identitySetting.js");

this.userList = new Array();

this.ctor = function () {

    this.filePath = helper.getUserSettingsFilePath();

    this.mainEmail = helper.getCurrentUsername();

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
    this.loadIdentitySetting(this.email)

}
this.loadIdentitySetting = function (email) {
    identitySetting.ctor(email);
}
this.save = function () {
    helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));
    identitySetting.save();
}
this.toGui = function () {

    $("#textSettingsOrganization").val(this.organization);

    $("#checkboxSettingsSingleAccount").prop("checked", this.useSingleAccount);
    $("#checkboxSettingsTakeOnlyOne").prop("checked", this.takeOnlyOne);

    userSettings.singleAccountToggle();

    $("#resettings").button();
    $("#savesettings").button();
    $("#deleteProfile").button().click(
        function () {
            helper.confirm("Delete profile? Are You sure? All data linked wth this profile will be lost.", deleteProfile);

        });


    $("#editOrgMemberShowPassword").button(
        {
            icons: {
                secondary: "ui-icon-notice"
            }

        }).click(
        function () {
            if ($("#editOrgMemberSecret").prop("type") == "password")
                $("#editOrgMemberSecret").prop("type", "text");
            else
                $("#editOrgMemberSecret").prop("type", "password");

        }
        );


    this.reloadIndentityChooser();

    identitySetting.toGui();

}
function deleteProfile() {
    var profile = $("#selectActiveProfile").val();
    if (profile != userSettings.mainEmail) {
        helper.deleteFolder(helper.getIdentityFolder(profile));
        helper.log("Identity profile " + profile + " deleted.");
        userSettings.loadIdentitySetting(userSettings.mainEmail);
        userSettings.email = userSettings.mainEmail;
        userSettings.reloadIndentityChooser();
    }
    else {
        helper.alert("The main profile can not been deleted!");
    }
}
this.reloadIndentityChooser = function () {
    var html = "<option " + (this.mainEmail == this.email ? "selected=\"selected\"" : "") + " value=\"" + this.mainEmail + "\">Main profile (" + this.mainEmail + ")</option>";
    this.Identities = helper.getDirectories(helper.getSettingsFolder());

    for (var i in this.Identities) {
        if (this.Identities[i] != this.mainEmail)
            html += "<option " + (this.Identities[i] == this.email ? "selected=\"selected\"" : "") + " value=\"" + this.Identities[i] + "\">" + this.Identities[i] + "</option>";
    }
    html += "<option value=\"-1\">Create new profile</option>";
    try {
        $("#selectActiveProfile").selectmenu("destroy");
    }
    catch (e)
    { }

    $("#selectActiveProfile").html(html);

    $("#selectActiveProfile").selectmenu({
        change: function () {
            selectActiveProfile_change();
        }
    }
    );
    this.manageDeleteProfile();
    helper.log("Running DataChief as " + this.email);
}
function selectActiveProfile_change() {

    var val = $("#selectActiveProfile").val();

    userSettings.manageDeleteProfile();
    if (val == "-1") {
        //new profile
        var newFormDialog = $("#editOrgMember").dialog({
            autoOpen: true,
            modal: true,
            width: "470",
            height: "310",

            buttons: {
                "Save user": function () {

                    // create identitySetting
                    if ($("#editOrgMemberEmail")[0].checkValidity()) {

                    }
                    else {
                        helper.alert("Please check email adress. Email is required and needs to be in valid form.");
                        return;
                    }
                    if ($("#editOrgMemberSecret").val().length == 0) {
                        helper.alert("User secret need to have at least on character.");
                        return;
                    }
                    userSettings.loadIdentitySetting($("#editOrgMemberEmail").val());
                    identitySetting.userSecret = $("#editOrgMemberSecret").val();
                    // save it
                    identitySetting.save();
                    helper.log("Identity profile " + $("#editOrgMemberEmail").val() + " created.");
                    // set value this.email to identitySetting
                    userSettings.email = identitySetting.email;
                    // set identitySetting to GUI
                    identitySetting.toGui();
                    // refresh profiles
                    userSettings.reloadIndentityChooser();

                    $(this).dialog("close");
                },
                Cancel: function () {
                    userSettings.cancelNewProfile();
                    $(this).dialog("close");
                }
            },
            close: function () {

            }
        });
    }
    else {
        userSettings.loadIdentitySetting(val);
        // set value this.email to identitySetting
        userSettings.email = identitySetting.email;
        // set identitySetting to GUI
        identitySetting.toGui();
        // refresh profiles
        userSettings.reloadIndentityChooser();
    }
}
this.cancelNewProfile = function () {
    $("#editOrgMemberEmail").val("");
    $("#editOrgMemberName").val("");
    $("#editOrgMemberSecret").val("");
    $("#editOrgMemberSecret1").val("");

    userSettings.reloadIndentityChooser();
}
this.manageDeleteProfile = function () {
    var val = $("#selectActiveProfile").val();
    if (val == userSettings.mainEmail) {
        //  $("#deleteProfile").prop('disabled', true);
        $("#deleteProfile").button({
            disabled: true
        });
    }
    else {
        // $("#deleteProfile").prop('disabled', false);
        $("#deleteProfile").button({
            disabled: false
        });
    }
}
this.fromGui = function () {

    this.organization = $("#textSettingsOrganization").val();



    this.useSingleAccount = $("#checkboxSettingsSingleAccount").is(':checked');
    this.takeOnlyOne = $("#checkboxSettingsTakeOnlyOne").is(':checked');
    identitySetting.fromGui();

}
this.singleAccountToggle = function () {
    if ($("#checkboxSettingsSingleAccount").is(':checked'))
        $("#SMTPSettings").attr('disabled', 'disabled');
    else
        $("#SMTPSettings").removeAttr('disabled');


}
