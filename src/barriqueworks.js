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
    userSettings.Identities = helper.getDirectories(helper.getSettingsFolder());;
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
    helper.log("Found some Barrique Works LLC Case study users, but not all.");
    return false;
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
            var is = userSettings.getIdentitySetting(barriqueUsers[i].username);
            is.email = barriqueUsers[i].username;
            is.oldEmail = barriqueUsers[i].username;
            is.userSecret = barriqueUsers[i].password;
            is.comment = barriqueUsers[i].decription;
            is.name = barriqueUsers[i].name;
            // IMAP and SMTP settings are from selected profile.     
            is.imapUserName = imapUserName;
            is.imapPassword = imapPassword;
            is.imapServer = imapServer;
            is.imapPort = imapPort;
            is.imapRequiresSSL = imapRequiresSSL;
            is.smtpUserName = smtpUserName;
            is.smtpPassword = smtpPassword;
            is.smtpServer = smtpServer;
            is.smtpPort = smtpPort;
            is.smtpRequiresSSL = smtpRequiresSSL;
            is.RequiresAuthentication = RequiresAuthentication;
            is.caseStudyAutomaticallyAdded = true;
            is.save();
            userSettings.reloadIndentityChooser();
        }
    }
    userSettings.checkCaseStudy();
    userSettings.identitySetting.ctor(userSettings.email);
    return;
}
this.uninstall = function () {
    for (var i in barriqueUsers) {
        // lets find appropriate identitySetting instance
        for (var j in userSettings.Identities)
            if (userSettings.Identities[j] == barriqueUsers[i].username) {
                // ok, remove only ones that were automatically added
                // in case when user typed existing BarriqueWorks identity as his/hers main identity
                if (userSettings.getIdentitySetting(userSettings.Identities[j]).caseStudyAutomaticallyAdded) {
                    helper.deleteFolder(helper.getIdentityFolder(barriqueUsers[i].username));
                    break;
                }
            }


    };
    userSettings.ctor();
    userSettings.toGui();
    userSettings.reloadIndentityChooser();
    userSettings.checkCaseStudy();
}