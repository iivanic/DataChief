var Imap = require('imap'), inspect = require('util').inspect;
var fs = require('fs'), fileStream;

var imap;
var progressCnt = 0;
var progressMax = 0;
var recievedCnt = 0;
var error = null;
var _box;
function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}



var imapbusy = false;
this.go = Go;
function Go(automatic) {
    if (imapbusy) {
        if (!automatic)
            helper.log("Send/recieve job already running. Please wait for finish.");
        return;
    }
    imapbusy = true;
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

    imap = new Imap({
        user: userSettings.identitySetting.imapUserName,
        password: userSettings.identitySetting.imapPassword,
        host: userSettings.identitySetting.imapServer,
        port: userSettings.identitySetting.imapPort,
        tls: userSettings.identitySetting.imapRequiresSSL
    });

    imap.once('ready', function () {
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

    imap.once('error', function (err) {
        helper.log(err + ".");
        if (err) {
            if (error)
                error += err;
            else
                error = err;
        }
        imap.end();
        imapbusy = false;
        $("#progressbar").progressbar({
            value: 100
        });
        window.setTimeout(resetProgressBar, 1000);
    });

    imap.once('end', function () {
        helper.log('Connection ended.');
        if (imap.error)
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

        imapbusy = false;
        if (!$("#IMAPTestDialog").is(":visible"))
            window.setTimeout("imap.go(true)", 30000);
        window.setTimeout(resetProgressBar, 1000);
    });


    helper.log("Connecting to <strong>" + imap._config.host + ":" + imap._config.port + "</strong>, tls=" + imap._config.tls + " as <strong>" + imap._config.user + "</strong>."); //(" + imap._config.password + ")
    $("#progressbar").progressbar({
        value: 5
    });
    imap.connect();
}
function resetProgressBar() {
    $("#progressbar").progressbar({
        value: 0
    });
}
function createDCFolder() {
    helper.log("Checking for <strong>Datachief</strong> folder...")
    imap.getBoxes("", getBoxesCallBack)

}
function getBoxesCallBack(err, boxes) {
    var bFound = false
    for (var i in boxes) {
        if (i == "Datachief") {
            helper.log("Found <strong>" + i + "</strong> folder.")
            bFound = true;
            break;
        }
    }
    if (!bFound) {
        helper.log("Folder not found.")
        imap.addBox("Datachief", addBoxCallback)

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
        imap.end();
        return;
    }
    else {
        helper.log("Folder <strong>Datachief</strong> created.");
        openDCFolder();
    }


}
var quedPcks = new Array();
function openDCFolder(user) {
    imap.openBox('Datachief', false, uploadMessages);
}
function uploadMessages(err, box) {
    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap.end();
        return;
    }
    else {
        helper.log("Opened <strong>datachief</strong> folder.")
        var files = helper.getFilesInDir(helper.getOutboxPath());
        progressMax = files.length;
        var c = 0;
        for (var i in files) {
            var to = files[i].substring(6);
            helper.log("Sending package to " + to);
            var filename = helper.join(helper.getOutboxPath(), files[i]);
            var body = helper.loadFile(filename);
            var message =
                "From: " + userSettings.email + "\n" +
                "To: " + to + " \n" +
                "Subject: DataChief package\n" +
                "\n" + body + "\n";

            quedPcks.push(helper.join(helper.getOutboxPath(), files[i]));
            c++;
            var r = imap.append(message, "", appendDone)

        }
        if (files.length == 0)
            readMessages1();

    }
}
function appendDone(err, o) {
    var el = quedPcks.shift();
    helper.deleteFile(el);
 /*   el.next().next().remove();
    el.next().remove();
    el.remove();*/
    $("#progressbar").progressbar({
        value: Math.abs(10 + 80 * progressCnt / progressMax)
    });
    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap.end();
        return;
    }
    else
        helper.log("Append done (id=" + o + ").")
    progressCnt++;
    helper.log(progressCnt + ", " + progressMax)
    if (progressCnt == progressMax)
        readMessages1();

}
function readMessages1() {

    // 
    // 4. Check incoming messages in my folder and download them
    helper.log("Search for my messages...");
    imap.search([['HEADER', 'TO', userSettings.identitySetting.email]], function (err, results) {
        if (err) {
            if (error)
                error += err;
            else
                error = err;
            imap.end();
            return;
        }
        if (results.length == 0) {
            helper.log("Found none.");
            imap.end();
            package.loadPackages();
            return;

        }
        helper.log("Found " + results.length + ".");
        var f = imap.fetch(results, { bodies: '' });
        f.on('message', function (msg, seqno) {
            helper.log('Message #' + seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
                console.log(prefix + 'Body');
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
                        imap.end();
                        return;
                    }
                }
                recievedCnt++;

            });
            msg.once('attributes', function (attrs) {
                console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
            });
            msg.once('end', function () {
                helper.log(prefix + 'Finished recieving message ' + seqno + '.');

            });
        });
        f.once('error', function (err) {
            if (err) {
                if (error)
                    error += err;
                else
                    error = err;
                imap.end();
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
    helper.log("Deleting " + msgs.length + " message(s).");
    try {
        imap.addFlags(msgs, '\\Deleted', function (err) {
            if (err) {
                if (error)
                    error += err;
                else
                    error = err;
                imap.end();
                return;
            }
            else {
                imap.end();
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
            imap.end();
            return;
        }
    }


}