var remote = require('electron').remote;

var identitySetting = null;

this.userList = new Array();

Object.defineProperty(this, "clientOnly", {
    get: function () {
        var arguments = remote.getGlobal('sharedObject').argv;

        return (this._clientOnly) || (arguments.indexOf("--clientonly") > -1);
    },
    set: function (val) {
        this._clientOnly = val;
    }
});

this.ctor = function () {

    this.filePath = helper.getUserSettingsFilePath();

    this.mainEmail = helper.getCurrentUsername();

    this.email = "";

    this.organization = "Barrique Works LLC";
    this.organizationSecret = "123";

    this.useSingleAccount = true;
    this.takeOnlyOne = true;
    this._clientOnly = true;

    this.userList = new Array();


    var file = "";
    try {
        file = helper.decrypt(helper.loadFile(this.filePath));
    } catch (ex) { }
    if (!file) {
        // first time creation
        this.email = helper.getCurrentUsername();
        this.userList.push(this.email);
        this.userList.push("initiator");
        this.wizadFinished = false;
        helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, null, 5)));

    } else {
        var loadedObj = JSON.parse(file);
        for (var attrname in loadedObj) {
            this[attrname] = loadedObj[attrname];
        }
    }



    this.loadIdentitySetting(this.email)
    if (!this.wizadFinished) {
        $(document).ready(function () {
            window.setTimeout(index.startWizard, 500);
        })
    } else {
        $(document).ready(function () {
            if (!helper.isAnyTest())
                imapTimer = window.setTimeout("imap.go(true)", 4000);
            $("#IMAPTest1").button();
            $("#buttonKnownServersSettings").button();
            $("#buttonKnownServersWizard").button();

        });
    }

}
this.identitySetting = identitySetting;
this.loadIdentitySetting = function (email) {
    identitySetting = require("./identitySetting.js");
    this.identitySetting = identitySetting;
    identitySetting.ctor(email);
}
this.getIdentitySetting = function (email) {
    var is = require("./identitySetting.js");
    is.ctor(email);
    return is;
}
this.save = function () {
    helper.saveTextFile(this.filePath, helper.encrypt(JSON.stringify(this, saveJSONReplacer, 5)));
    identitySetting.save();
    helper.log("Settings saved.");
}
this.last_server = null;
this.last_port = null;
this.last_tls = null;
this.applyWellKnownServer = function (s, p, t) {
    userSettings.last_server.val(s);
    userSettings.last_port.val(p);
    userSettings.last_tls.prop("checked", t == "true");

}
this.showWellKnownServers = function (_server, _port, _tls) {
    userSettings.last_server = _server;
    userSettings.last_port = _port;
    userSettings.last_tls = _tls;
    var html = ''
    for (var i in imap.wellKnownServers) {
        var name = imap.wellKnownServers[i].name;
        var server = imap.wellKnownServers[i].server;
        var port = imap.wellKnownServers[i].port;
        var tls = imap.wellKnownServers[i].TSL;
        html += "<option port=" + port + " tls=" + tls + " value='" + server + "'" + (_server.val() == server ? "selected" : "") + ">" + name + "</option>"
    }
    $("#WellKnownIMAPServersDialogList").html(html);
    $("#WellKnownIMAPServersDialog").dialog({
        resizable: false,
        height: 295,
        width: 350,
        modal: true,
        buttons: {
            "Select server": function () {
                var s = $("#WellKnownIMAPServersDialog select").val();
                var p = $("#WellKnownIMAPServersDialog select option:selected").attr("port")
                var t = $("#WellKnownIMAPServersDialog select option:selected").attr("tls")
                userSettings.applyWellKnownServer(s, p, t);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

}

function saveJSONReplacer(key, value) {

    if (key == "identitySetting") return undefined;
    else if (key == "_parent") return undefined;
    else return value;
}
this.checkCaseStudy = function () {
    if (!barrique.isInstalled()) {
        $("#addRemoveCaseStudyProfiles").button({
            text: true,
            label: "Add Barrique Works LLC Case study Profiles"
        }).click(
            function () {
                helper.confirm("Add Barrique Works LLC Case study profiles?", barrique.install);

            });

        //-------
        $("#addRemoveCaseStudyProfilesWizard").button({
            text: true,
            label: "Add Barrique Works LLC Case study Profiles"
        }).click(
            function () {
                helper.confirm("Add Barrique Works LLC Case study profiles?", barrique.install);

            });
        //-------
    } else {
        $("#addRemoveCaseStudyProfiles").button({
            text: true,
            label: "Remove Case study Profiles"
        }).click(
            function () {
                helper.confirm("Remove Barrique Works LLC Case study profiles?", barrique.uninstall);

            });

        $("#addRemoveCaseStudyProfilesWizard").button({
            text: true,
            label: "Remove Case study Profiles"
        }).click(
            function () {
                helper.confirm("Remove Barrique Works LLC Case study profiles?", barrique.uninstall);

            });
    }

}
this.toGui = function () {

    $("#textSettingsOrganization").val(this.organization);

    $("#checkboxSettingsSingleAccount").prop("checked", this.useSingleAccount);
    $("#checkboxSettingsTakeOnlyOne").prop("checked", this.takeOnlyOne);

    $("#textSettingsOrganizationSecret").val(this.organizationSecret);
    $("#textSettingsOrganizationSecret1").val(this.organizationSecret);

    userSettings.singleAccountToggle();

    $("#resettings").button();
    $("#savesettings").button();
    $("#startStartWizerd").button();
    $("#deleteProfile").button().click(
        function () {
            helper.confirm("Delete profile? Are You sure? All data linked wth this profile will be lost.", deleteProfile);

        });


    this.checkCaseStudy();

    $("#editOrgMemberShowPassword").button({
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
this.applyIMAPSettingsToAllProfiles = function (m) {

    for (var i in userSettings.Identities) {
        if (userSettings.Identities[i] != m.email) {
            var s = userSettings.getIdentitySetting(userSettings.Identities[i]);
            s.imapUserName = m.imapUserName;
            s.imapPassword = m.imapPassword;
            s.imapServer = m.imapServer;
            s.imapPort = m.imapPort;
            s.imapRequiresSSL = m.imapRequiresSSL;
            s.save();
        }
    }
}
this.applySharedSecretSettingsToAllProfiles = function (m) {

    for (var i in userSettings.Identities) {
        if (userSettings.Identities[i] != m.email) {
            var s = userSettings.getIdentitySetting(userSettings.Identities[i]);
            s.userSecret = m.userSecret;
            s.save();
        }
    }
}

function deleteProfile() {
    var profile = $("#selectActiveProfile").val();
    if (profile != userSettings.mainEmail) {
        helper.deleteFolder(helper.getIdentityFolder(profile));
        helper.log("Identity profile " + profile + " deleted.");
        userSettings.loadIdentitySetting(userSettings.mainEmail);
        userSettings.email = userSettings.mainEmail;
        userSettings.reloadIndentityChooser();
    } else {
        helper.alert("The main profile can not been deleted!");
    }
}
this.reloadIndentityChooser = function () {
    var profileHTML; //for combo for adding commands in publish tab
    var html = "<option " + (this.mainEmail == this.email ? "selected=\"selected\"" : "") + " value=\"" + this.mainEmail + "\">Main profile (" + this.mainEmail + ")</option>";

    this.Identities = helper.getDirectories(helper.getSettingsFolder());

    for (var i in this.Identities) {
        if (this.Identities[i] != this.mainEmail)
            html += "<option " + (this.Identities[i] == this.email ? "selected=\"selected\"" : "") + " value=\"" + this.Identities[i] + "\">" + this.Identities[i] + "</option>";
        profileHTML += "<option value=\"" + this.Identities[i] + "\">" + this.Identities[i] + "</option>";
    }
    profileHTML += "<option value=\"-1\">All users that have packages</option>";

    html += "<option value=\"-1\">Create new profile</option>";
    try {
        $("#selectActiveProfile").selectmenu("destroy");
    } catch (e) { }

    $("#selectActiveProfile").html(html);

    $("#commandAddCommandSelectUser").html(profileHTML);

    $("#selectActiveProfile").selectmenu({
        change: function () {
            selectActiveProfile_change();
        }
    });
    $("#buttonRunScripts").selectmenu({
        change: function () {
            buttonRunScripts_change();
        },
        width: "100%"
    });
    userSettings.refreshSelectActiveProfile(); //selectActiveProfile").selectmenu("refresh");
    this.manageDeleteProfile();
    helper.log("Running DataChief as " + this.email);
    var pjson = require('../package.json');

    if (this.mainEmail != this.identitySetting.email) {
        document.title = pjson.name + " v" + pjson.version + " running as " + this.email + ".";
    } else
        document.title = pjson.name + " v" + pjson.version + ".";

    filler.reload();
    publish.reload();
    index.reloadEditor();
    dataCollection.refreshDB();
    dataCollection.refreshSentDB();
    dataCollection.refreshBroadcastDB();
}

function buttonRunScripts_change() {
    var val = $("#buttonRunScripts").val();
    // set dropdown to choose
    $('#buttonRunScripts').val("");
    $("#buttonRunScripts").selectmenu("refresh");
    if (val.length) {
        helper.confirm("Run " + val + " script? This may destroy all of Your collected data.", buttonRunScriptsGo, val)
    }
}

function buttonRunScriptsGo(val) {

    //require("electron").ipcRenderer.send("run-test-script", '--' + val );
    if (imap.imapbusy == true) {
        helper.alert("Communication is active. Try again when it's done.")
        $('#buttonRunScripts').selectmenu("refresh");
        return;

    }
    if (imapTimer)
        window.clearTimeout(imapTimer);

    helper.checkCommandLineAgain(['--' + val]);

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
            height: "320",

            buttons: {
                "Save user": function () {

                    // create identitySetting
                    if ($("#editOrgMemberEmail")[0].checkValidity()) {

                    } else {
                        helper.alert("Please check email adress. Email is required and needs to be in valid form.");
                        return;
                    }
                    if ($("#editOrgMemberSecret").val().length == 0) {
                        helper.alert("User secret need to have at least on character.");
                        return;
                    }
                    userSettings.closeAllTabs();
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
    } else {
        userSettings.closeAllTabs();
        userSettings.loadIdentitySetting(val);
        // set value this.email to identitySetting
        userSettings.email = identitySetting.email;
        // set identitySetting to GUI
        identitySetting.toGui();
        // refresh profiles
        userSettings.reloadIndentityChooser();
    }
    userSettings.refreshSelectActiveProfile();

}
this.refreshSelectActiveProfile = function () {
    // oldActiveTab dropdown has zero width unless refresh is called when visible
    try {
        var oldActiveTab = $("#maintabs").tabs("option", "active");
        $("#maintabs").tabs("option", "active", 4);
        $("#selectActiveProfile").selectmenu("refresh");
        $("#maintabs").tabs("option", "active", oldActiveTab);
    } catch (e) { }
}
this.closeAllTabs = function () {
    // close graph
    dataCollection.setGraph4Mermaide("graph TD\nA[\"...\"]");
    // close open designers

    $("div[id^='tabs-").each(function () {

        var el = $("li[aria-controls^='" + $(this).prop("id"));
        el.remove();
        $(this).remove();
    });
    $("div[id^='Fillertabs-").each(function () {

        var el = $("li[aria-controls^='" + $(this).prop("id"));
        el.remove();
        $(this).remove();
    });

    $('#tabs').tabs('refresh');
    $('#Fillertabs').tabs('refresh');


}
this.activeProfile_change = selectActiveProfile_change;

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
    } else {
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
    this.organizationSecret = $("#textSettingsOrganizationSecret").val();
    identitySetting.fromGui();

}
this.singleAccountToggle = function () {
    if ($("#checkboxSettingsSingleAccount").is(':checked'))
        $("#SMTPSettings").attr('disabled', 'disabled');
    else
        $("#SMTPSettings").removeAttr('disabled');


}
this.smtpTest = function () {


    $("#SMTPTestDialogLog").html("");
    $("#SMTPTestDialog").dialog({
        autoOpen: true,
        modal: true,
        width: "970",
        height: "410",

        buttons: {
            "Close": function () {
                $("#SMTPTestDialog").dialog("close");
            }
        }
    });
    if ($("#startDialog").is(":visible"))
        startwizardsteps.fromGui();
    //     window.setTimeout(imap.go, 500);

}
this.imapTest = function () {

    $("#IMAPTestDialogLog").html("");
    $("#IMAPTestDialog").dialog({
        autoOpen: true,
        modal: true,
        width: "970",
        height: "410",

        buttons: {
            "Close": function () {
                $("#IMAPTestDialog").dialog("close");
            }
        }
    });
    if ($("#startDialog").is(":visible"))
        startwizardsteps.fromGui();
    window.setTimeout(imap.go, 500);
}