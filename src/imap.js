var Imap = require('imap'), inspect = require('util').inspect;
var fs = require('fs'), fileStream;

var imap_;
var progressCnt = 0;
var progressMax = 0;
var recievedCnt = 0;
var error = null;
var _box;
function openInbox(cb) {
    imap_.openBox('INBOX', true, cb);
}

this.callback = null;
this.test = null;
this.callback1 = null;
this.test1 = null;

this.imapbusy = false;

this.go = Go;
function Go(automatic) {
    if (imap.imapbusy) {
        if (!automatic)
            helper.log("Send/recieve job already running. Please wait for finish.");
        return;
    }
    imap.imapbusy = true;
    error = null;
    recievedCnt = 0;
    progressCnt = 0;
    progressbar = $("#progressbar").progressbar({
        value: 1
    });
    progressbarValue = progressbar.find(".ui-progressbar-value");

    progressbarValue.css({
        "background": '#FF1B0F'
    });

    imap_ = new Imap({
        user: userSettings.identitySetting.imapUserName,
        password: userSettings.identitySetting.imapPassword,
        host: userSettings.identitySetting.imapServer,
        port: userSettings.identitySetting.imapPort,
        tls: userSettings.identitySetting.imapRequiresSSL
    });

    imap_.once('ready', function () {
        $("#progressbar").progressbar({
            value: 5
        });
        // 1. Connect
        helper.log("Connected.");
        // 2. Check for DC folder

        openInbox(function (err, box) {
            if (err) throw err;
            _box = box;
            createDCFolder();
            // 3. Take package by package, check folder and upload

            $("#progressbar").progressbar({
                value: 10
            });
            return;

        });
    });

    imap_.once('error', function (err) {
        helper.log(err + ".");
        if (err) {
            if (error)
                error += err;
            else
                error = err;
        }
        imap_.end();
        helper.alert("IMAP: " + err);
        imap.imapbusy = false;
        $("#progressbar").progressbar({
            value: 100
        });
        window.setTimeout(resetProgressBar, 1000);
    });

    imap_.once('end', function () {
        helper.log('Connection ended.');
        if (imap_.error)
            return;
        $("#progressbar").progressbar({
            value: 100
        });

        publish.refreshOutB();
        if (!error) {
            //  if (progressMax != 0 && recievedCnt != 0) {
            helper.log("Success. Sent " + progressMax + " package(s), recived " + recievedCnt + " package(s).");
            //   }
        }
        else {
            helper.log(error);

        }

        imap.imapbusy = false;
        if (!$("#IMAPTestDialog").is(":visible") && !helper.isAnyTest())
            if (!imapTimer)
                imapTimer = window.setTimeout("imap.go(true)", 30000);
        window.setTimeout(resetProgressBar, 1000);
        if (imap.callback1)
            imap.callback1(error, imap.test1);

        if (imap.callback)
            imap.callback(error, imap.test);
    });


    helper.log("Connecting to <strong>" + imap_._config.host + ":" + imap_._config.port + "</strong>, tls=" + imap_._config.tls + " as <strong>" + imap_._config.user + "</strong>."); //(" + imap._config.password + ")
    $("#progressbar").progressbar({
        value: 5
    });
    imap_.connect();
}
function resetProgressBar() {
    $("#progressbar").progressbar({
        value: 0
    });
}
function createDCFolder() {
    //  helper.log("Checking for <strong>Datachief</strong> folder...")
    imap_.getBoxes("", getBoxesCallBack)

}
function getBoxesCallBack(err, boxes) {
    var bFound = false
    for (var i in boxes) {
        if (i == "Datachief") {
            // helper.log("Found <strong>" + i + "</strong> folder.")
            bFound = true;
            break;
        }
    }
    if (!bFound) {
        helper.log("Folder not found.")
        imap_.addBox("Datachief", addBoxCallback)

    }
    else
        openDCFolder();
}
function addBoxCallback(err) {

    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap_.end();
        return;
    }
    else {
        helper.log("Folder <strong>Datachief</strong> created.");
        openDCFolder();
    }


}
var quedPcks = new Array();
function openDCFolder(user) {
    imap_.openBox('Datachief', false, uploadMessages);
}
function uploadMessages(err, box) {
    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap_.end();
        return;
    }
    else {
        //   helper.log("Opened <strong>datachief</strong> folder.")
        var files = helper.getFilesInDir(helper.getOutboxPath());
        progressMax = files.length;
        var c = 0;
        for (var i in files) {
            var to = files[i].substring(6).replace('[BROADCAST]', '');
            if (to.length == 0)
                helper.log("ERROR!");
            helper.log("Sending package to " + (files[i].substring(6).indexOf("[BROADCAST]") > -1 ? to + " (BROADCAST)" : to));
            var filename = helper.join(helper.getOutboxPath(), files[i]);
            var body = helper.loadFile(filename);
            var message =
                "From: " + userSettings.email + "\n" +
                "To: " + to + " \n" +
                "Subject: DataChief package\n" +
                "\n" + body + "\n";

            quedPcks.push(helper.join(helper.getOutboxPath(), files[i]));
            c++;
            var r = imap_.append(message, "", appendDone)

        }
        if (files.length == 0)
            readMessages1();

    }
}
function appendDone(err, o) {
    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap_.end();
        return;
    }
    //   else
    //       helper.log("Append done (id=" + o + ").")
    var el = quedPcks.shift();
    sent.movePackageToSent(el);
    helper.deleteFile(el);
    /*   el.next().next().remove();
       el.next().remove();
       el.remove();*/
    $("#progressbar").progressbar({
        value: Math.abs(10 + 80 * progressCnt / progressMax)
    });

    progressCnt++;
    // helper.log(progressCnt + ", " + progressMax)
    if (progressCnt == progressMax)
        readMessages1();

}
function readMessages1() {

    // 
    // 4. Check incoming messages in my folder and download them
    //  helper.log("Search for my messages...");
    imap_.search([['HEADER', 'TO', userSettings.identitySetting.email]], function (err, results) {
        if (err) {
            if (error)
                error += err;
            else
                error = err;
            imap_.end();
            return;
        }
        if (results.length == 0) {
            helper.log("Found none.");
            imap_.end();
            package.loadPackages();
            return;

        }
        helper.log("Found " + results.length + ".");
        var f = imap_.fetch(results, { bodies: '' });
        f.on('message', function (msg, seqno) {
            //  helper.log('Message #' + seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
                // console.log(prefix + 'Body');
                var path = helper.join(helper.getInboxPath(), 'msg-' + seqno + '-body.txt');
                try {
                    stream.pipe(fs.createWriteStream(path));
                }
                catch (err) {
                    if (err) {
                        if (error)
                            error += err;
                        else
                            error = err;
                        imap_.end();
                        return;
                    }
                }
                recievedCnt++;

            });
            msg.once('attributes', function (attrs) {
                //console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function () {
                // helper.log(prefix + 'Finished recieving message ' + seqno + '.');

            });
        });
        f.once('error', function (err) {
            if (err) {
                if (error)
                    error += err;
                else
                    error = err;
                imap_.end();
                helper.alert("IMAP: " + err);
                return;
            }
        });
        f.once('end', function () {
            helper.log('Done fetching all messages!');
            deleteMessages(results);

        });
    });


}
function deleteMessages(msgs) {
    //helper.log("Deleting " + msgs.length + " message(s).");
    try {
        imap_.addFlags(msgs, '\\Deleted', function (err) {
            if (err) {
                if (error)
                    error += err;
                else
                    error = err;
                imap_.end();
                return;
            }
            else {
                imap_.end();
                package.loadPackages();
            }
        });
    }
    catch (err) {
        if (err) {
            if (error)
                error += err;
            else
                error = err;
            imap_.end();
            return;
        }
    }


}