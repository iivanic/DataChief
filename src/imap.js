var Imap = require('imap'), inspect = require('util').inspect;

var imap = new Imap({
    user: userSettings.imapUserName,
    password: userSettings.imapPassword,
    host: userSettings.imapServer,
    port: userSettings.imapPort,
    tls: userSettings.imapRequiresSSL
});

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

imap.once('ready', function() {
    $("#progressbar").progressbar({
        value: 5
    });

    publish.log("Connected to <strong>" + imap._config.host + ":" + imap._config.port + "</strong> as <strong>" + imap._config.user + "</strong>.");

    openInbox(function(err, box) {
        if (err) throw err;

        createDCFolder();

        var f = imap.seq.fetch('1:3', {
            bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
            struct: true

        });



        $("#progressbar").progressbar({
            value: 10
        });
        
        f.on('message', function(msg, seqno) {
            publish.log('Message #%d', seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function(stream, info) {
                var buffer = '';
                stream.on('data', function(chunk) {
                    buffer += chunk.toString('utf8');
                });
                stream.once('end', function() {
                    publish.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                });
            });
            msg.once('attributes', function(attrs) {
                publish.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
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
    publish.log(err);
});

imap.once('end', function() {
    publish.log('Connection ended');
    $("#progressbar").progressbar({
        value: 100
    });
});

$("#progressbar").progressbar({
    value: 5
});
imap.connect();

function createDCFolder() {
    publish.log("Checking for <strong>datachief</strong> folder...")
    imap.getBoxes("", getBoxesCallBack)

}
function getBoxesCallBack(err, boxes) {
    var bFound = false
    for (var i in boxes) {
        if (i == "datachief") {
            publish.log("Found <strong>" + i + "</strong> folder.")
            bFound = true;
        }
    }
    if (!bFound) {
        publish.log("Folder not found.")
        imap.addBox("datachief", addBoxCallback)

    }
}
function addBoxCallback(err) {
    if (err)
        publish.log(err);
    else
        publish.log("Folder <strong>datachief</strong> created.");

}

function checkUserFolder(user) {
    imap.openBox('INBOX/datachief', true, openBoxcheckUserFolderCallback);
}
function openBoxcheckUserFolderCallback() {
    publish.log("Opened <strong>datachief</strong> folder.")
}
