var barriqueUsers = [
    { username: "mary@barriqueworks.com", password: "123", name: "Mary S", decription: "CEO" },
    { username: "richard@barriqueworks.com", password: "123", name: "Richard V", decription: "Accounting" },
    { username: "john@barriqueworks.com", password: "123", name: "John L", decription: "HR" },
    { username: "daniel@barriqueworks.com", password: "123", name: "Daniel S", decription: "Quality manager" },
    { username: "james@barriqueworks.com", password: "123", name: "James R", decription: "IT" },
    { username: "patricia@barriqueworks.com", password: "123", name: "Patricia M", decription: "Sales Manager" },
    { username: "jennifer@barriqueworks.com", password: "123", name: "Jennifer B", decription: "Sales Representative" },
    { username: "michael@barriqueworks.com", password: "123", name: "Michael W", decription: "Sales Representative" },
    { username: "elizabeth@barriqueworks.com", password: "123", name: "Elizabeth F", decription: "Sales Representative" },
    { username: "margaret@barriqueworks.com", password: "123", name: "Margaret R", decription: "Customer support" },
    { username: "robert@barriqueworks.com", password: "123", name: "Robert P", decription: "Production Manager" },
    { username: "william@barriqueworks.com", password: "123", name: "William D", decription: "Production Technician" },
    { username: "linda@barriqueworks.com", password: "123", name: "Linda J", decription: "Production Technician" },
    { username: "david@barriqueworks.com", password: "123", name: "David F", decription: "Production Technician" }
]

this.isInstalled = function () {
    userSettings.Identities =  helper.getDirectories(helper.getSettingsFolder());;
    var atLeastOneNotfound = false;
    var atLeastOneFound = false;
    for (var i in barriqueUsers) {
        var found = false;
        for (var j in userSettings.Identities) {
            if (userSettings.Identities[j] == barriqueUsers[i].username) {
                found = true;
            }
        }
        if (found) {
            atLeastOneFound = true;
        }
        else {
            atLeastOneNotfound = true;
        }
    }
    if (!atLeastOneFound) {
        //found none
        return false;
    }
    if (atLeastOneFound && !atLeastOneNotfound) {
        // all found
        return true;
    }
    helper.log("Found some Barrique Works LLC Case study users, but not all. You can remove Case study users and then install them again.");
    return true;
}
this.install = function () {

    // lets remember IMAP and SMTP settings
    var imapUserName = userSettings.identitySetting.imapUserName;
    var imapPassword = userSettings.identitySetting.imapPassword;
    var imapServer = userSettings.identitySetting.imapServer;
    var imapPort = userSettings.identitySetting.imapPort;
    var imapRequiresSSL = userSettings.identitySetting.imapRequiresSSL;
    var smtpUserName = userSettings.identitySetting.smtpUserName;
    var smtpPassword = userSettings.identitySetting.smtpPassword;
    var smtpServer = userSettings.identitySetting.smtpServer;
    var smtpPort = userSettings.identitySetting.smtpPort;
    var smtpRequiresSSL = userSettings.identitySetting.smtpRequiresSSL;
    var RequiresAuthentication = userSettings.identitySetting.RequiresAuthentication;

    for (var i in barriqueUsers) {
        var notfound = true;
        for (var j in userSettings.Identities)
            if (userSettings.Identities[j] == barriqueUsers[i].username) {
                notfound = false;
                break;
            }
        if (notfound) {
            userSettings.identitySetting.ctor(barriqueUsers[i].username);
            userSettings.identitySetting.email = barriqueUsers[i].username;
            userSettings.identitySetting.userSecret = barriqueUsers[i].password;
            userSettings.identitySetting.comment = barriqueUsers[i].decription;
            userSettings.identitySetting.name = barriqueUsers[i].name;
            // IMAP and SMTP settings are from selected profile.     
            userSettings.identitySetting.imapUserName = imapUserName;
            userSettings.identitySetting.imapPassword = imapPassword;
            userSettings.identitySetting.imapServer = imapServer;
            userSettings.identitySetting.imapPort = imapPort;
            userSettings.identitySetting.imapRequiresSSL = imapRequiresSSL;
            userSettings.identitySetting.smtpUserName = smtpUserName;
            userSettings.identitySetting.smtpPassword = smtpPassword;
            userSettings.identitySetting.smtpServer = smtpServer;
            userSettings.identitySetting.smtpPort = smtpPort;
            userSettings.identitySetting.smtpRequiresSSL = smtpRequiresSSL;
            userSettings.identitySetting.RequiresAuthentication = RequiresAuthentication;

            userSettings.identitySetting.save();
            userSettings.reloadIndentityChooser();
        }
    }
    userSettings.checkCaseStudy();
    return;
}
this.uninstall = function () {
    for (var i in barriqueUsers) {
        helper.deleteFolder(helper.getIdentityFolder(barriqueUsers[i].username));
    };
    userSettings.ctor();
    userSettings.toGui();
    userSettings.reloadIndentityChooser();
    userSettings.checkCaseStudy();
}