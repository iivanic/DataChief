var Imap = require('imap'), inspect = require('util').inspect;

var imap = new Imap({
    user: userSettings.imapUserName,
    password: userSettings.imapPassword,
    host: userSettings.imapServer,
    port: userSettings.imapPort,
    tls: userSettings.imapRequiresSSL
});
var progressCnt = 0;
var progressMax = 0;
function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    $("#progressbar").progressbar({
        value: 5
    });
    // 1. Connect
    publish.log("Connected to <strong>" + imap._config.host + ":" + imap._config.port + "</strong> as <strong>" + imap._config.user + "</strong>.");
    // 2. Check for DC folder

    openInbox(function(err, box) {
        if (err) throw err;

        createDCFolder();
        // 3. Take package by package, check folder and upload

        // 4. Check incoming messages in my folder and download them
        var f = imap.seq.fetch('1:3', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true

        });



        $("#progressbar").progressbar({
            value: 10
        });
        return;
        f.on('message', function(msg, seqno) {
            publish.log('Message ' + seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    publish.log(prefix + 'Parsed header: ' + inspect(Imap.parseHeader(buffer)));
                });
            });
            msg.once('attributes', function(attrs) {
                publish.log(prefix + 'Attributes: ' + inspect(attrs, false, 8));
            });
            msg.once('end', function() {
                publish.log(prefix + 'Finished');
            });
        });
        f.once('error', function(err) {
            publish.log('Fetch error: ' + err);
        });
        f.once('end', function() {
            publish.log('Done fetching all messages!');
            imap.end();
        });
    });
});

imap.once('error', function(err) {
    publish.log(err + ".");
    $("#progressbar").progressbar({
        value: 90
    });
});

imap.once('end', function() {
    publish.log('Connection ended.');
    $("#progressbar").progressbar({
        value: 100
    });
    publish.refreshOutB();
});

$("#progressbar").progressbar({
    value: 5
});
this.go = Go;
function Go() {
    progressCnt = 0;
       publish.log('Connecting...');

    imap.connect();
}
function createDCFolder() {
    publish.log("Checking for <strong>Datachief</strong> folder...")
    imap.getBoxes("", getBoxesCallBack)

}
function getBoxesCallBack(err, boxes) {
    var bFound = false
    for (var i in boxes) {
        if (i == "Datachief") {
            publish.log("Found <strong>" + i + "</strong> folder.")
            bFound = true;
            break;
        }
    }
    if (!bFound) {
        publish.log("Folder not found.")
        imap.addBox("Datachief", addBoxCallback)

    }
    else
        openDCFolder();
}
function addBoxCallback(err) {
    if (err)
        publish.log(err);
    else {
        publish.log("Folder <strong>Datachief</strong> created.");
        openDCFolder();
    }


}
var quedPcks = new Array();
function openDCFolder(user) {
    imap.openBox('Datachief', false, uploadMessages);
}
function uploadMessages(err, box) {
    if (err) {
        publish.log(err);
    }
    else {
        publish.log("Opened <strong>datachief</strong> folder.")
        var files = helper.getFilesInDir(helper.getOutboxPath());
        progressMax = files.length;
        var c = 0;
        for (var i in files) {
            var to = files[i].substring(6);
            publish.log("Sending packagage to " + to);
            var filename = helper.join(helper.getOutboxPath(), files[i]);
            var body = helper.loadFile(filename);
            var message =
                "From: " + userSettings.email + "\n" +
                "To: " + to + " \n" +
                "Subject: DataChief package\n" +
                "\n" + body + "\n";

            quedPcks.push($("#olistItem" + c));
            c++;
            var r = imap.append(message, "", appendDone)

        }
        imap.end();
    }
}
function appendDone(err, o) {
    var el = quedPcks.shift();
    helper.deleteFile($(el).val());
    el.next().next().remove();
    el.next().remove();
    el.remove();
    $("#progressbar").progressbar({
        value: Math.abs(10 + 80 * progressCnt / progressMax)
    });
    progressCnt++;
    if (err)
        publish.log(err);
    else
        publish.log("Append done (id=" + o + ").")
}
