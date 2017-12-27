var Imap = require('imap'),
    inspect = require('util').inspect;
var fs = require('fs'),
    fileStream;

var imap_;
var progressCnt = 0;
var progressMax = 0;
var recievedCnt = 0;
var error = null;
var _box;

this.wellKnownServers = [{
        name: "AOL Mail",
        server: "imap.aol.com",
        port: 993,
        TSL: true
    },
    {
        name: "Gmail",
        server: "imap.gmail.com",
        port: 993,
        TSL: true
    },
    {
        name: "Outlook.com ex Live Mail, Hotmail",
        server: "imap-mail.outlook.com",
        port: 993,
        TSL: true
    },
    {
        name: "Yahoo Mail",
        server: "imap.mail.yahoo.com",
        port: 993,
        TSL: true
    },
    {
        name: "Yandex Mail",
        server: "imap.yandex.com",
        port: 993,
        TSL: true
    },
    {
        name: "Zoho",
        server: "imap.zoho.eu",
        port: 993,
        TSL: true
    }
];

function openInbox(cb) {

    imap_.openBox('INBOX', true, cb);
}

this.callback = null;
this.test = null;
this.callback1 = null;
this.test1 = null;

this.imapbusy = false;
//for automatic recovery
this.lastLoginWasSuccess = false;
this.autoRecoveryCounter = 0;
this.maxAutoRecoveryCount = 3;
//
this.imapMessageTemplate = helper.loadTextFile("../templates/IMAPMessageTemplate.txt");;

this.go = Go;

function Go(automatic) {
    if (imap.imapbusy) {
        if (!automatic)
            helper.log("Send/recieve job already running. Please wait for finish.");
        return;
    }
    if (imap.autoRecoveryCounter>0)
    {
        helper.log("Imap.Go(): autoRecoveryCounter=" + imap.autoRecoveryCounter.toString() )
    }
    imap.lastLoginWasSuccess = false;
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
        tls: userSettings.identitySetting.imapRequiresSSL,
        debug: console.log,
        connTimeout : 20000
    });

    imap_.once('ready', function () {
        $("#progressbar").progressbar({
            value: 5
        });
        imap.lastLoginWasSuccess = true;
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
    imap_.once("update", function (seqno, info) {
        helper.log("Imap event \"update\" " + seqno + ".");
    });
    imap_.once("alert", function (msg) {
        helper.log("Imap event  \"alert\" from server " + _config.host + ": " + msg + ".");
        helper.alert("Message from server " + _config.host + ": " + msg);
    });
    imap_.once('expunge', function (seqno) {
        helper.log("Imap event \"expunged\" " + seqno + ".");
    });

    imap_.once('error', function (err) {
        // tu nekad pukne  
        //Imap Connection event "error": Error: write EINVAL.
        //Imap Connection event "error": Error: read ECONNRESET.
        //Imap Connection event "error": Error: Timed out while connecting to server

        helper.log("Imap Connection event \"error\": " + err + ".");
        if (err) {
            if (error)
                error += err;
            else
                error = err;
        }
        imap_.end();

        

        imap.imapbusy = false;
        $("#progressbar").progressbar({
            value: 100
        });
        window.setTimeout(resetProgressBar, 1000);
        if (imap.lastLoginWasSuccess) {
            imap.autoRecoveryCounter++;
            if (imap.autoRecoveryCounter <= imap.maxAutoRecoveryCount) {
                helper.log(
                    "Trying to recover: " +
                    imap.autoRecoveryCounter.toString() +
                    " / " +
                    imap.maxAutoRecoveryCount.toString());
                window.setTimeout("imap.Go()", 500);
            } else {
                imap.autoRecoveryCounter = 0;
                helper.alert("IMAP: " + err);
            }
        }
        else
        {
            helper.alert("IMAP: " + err);
        }
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
        } else {
            helper.log(error);

        }

        if (imap.callback1)
            window.setTimeout(imap.continue1, 500);

        if (imap.callback)
            window.setTimeout(imap.continue, 500);

        if (!$("#IMAPTestDialog").is(":visible") && !helper.isAnyTest())
            if (!imapTimer)
                imapTimer = window.setTimeout("imap.go(true)", 30000);
        window.setTimeout(resetProgressBar, 1000);
        imap.imapbusy = false;

    });


    helper.log("Connecting to <strong>" + imap_._config.host + ":" + imap_._config.port + "</strong>, tls=" + imap_._config.tls + " as <strong>" + imap_._config.user + "</strong>."); //(" + imap._config.password + ")
    $("#progressbar").progressbar({
        value: 5
    });
    imap_.connect();
}
this.continue = function (error) {
    imap.callback(error, imap.test);
}
this.continue1 = function (error) {
    imap.callback1(error, imap.test1);
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
        helper.log("Box not found.")
        imap_.addBox("Datachief", addBoxCallback)

    } else
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
    } else {
        helper.log("Box <strong>Datachief</strong> created.");
        openDCFolder();
    }


}
var quedPcks = new Array();

function openDCFolder(user) {
    helper.log("Open box Datachief");
    imap_.openBox('Datachief', false, uploadMessages);
}

function uploadMessages(err, box) {
    helper.log("Active box is: " + box.name + ", readOnly = " + box.readOnly + ", persistentUIDs = " + box.persistentUIDs);
    if (err) {
        if (error)
            error += err;
        else
            error = err;
        imap_.end();
        return;
    } else {
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
            var body = body.replace(/(.{80})/g, "$1\r\n");
            var txt = "Data chief package in attachment."
            var message = imap.imapMessageTemplate;
            message = message.replace(/\[DCMESAGETITLE\]/gi, to);
            message = message.replace(/\[DCMESAGEFROM\]/gi, userSettings.email);
            message = message.replace(/\[DCMESAGETO\]/gi, to);
            message = message.replace(/\[DCMESSAGEATTACHMENTBOUNDARY\]/gi, helper.generateGUID());
            message = message.replace(/\[DCMESSAGEATTHTMLBOUNDARY\]/gi, helper.generateGUID());
            message = message.replace(/\[DCMESAGEBODYTEXT\]/gi, txt);
            message = message.replace(/\[DCMESAGEBODYHTML\]/gi, "<p>" + txt + "</p>");
            message = message.replace(/\[DCMESSAGEATTACHMENTENCODEDLINE76\]/gi, body);

            quedPcks.push(helper.join(helper.getOutboxPath(), files[i]));
            c++;
            helper.log("Imap appending " + (parseInt(i) + 1) + "/" + files.length);
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
    helper.log("Append done (id=" + o + ").")
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
        readMessages1(); //window.setTimeout(readMessages1,1000);

}
var redMessages = 0;

function readMessages1() {

    // 
    // 4. Check incoming messages in my folder and download them
    //  helper.log("Search for my messages...");
    var s1 = "TO";
    //live.com for some reason asumes that all messages are for you (to:)
    if (userSettings.identitySetting.imapServer.toLowerCase().trim() == "imap-mail.outlook.com") {
        s1 = 'SUBJECT';
    }
    redMessages = 0;
    imap_.search([
        ['HEADER', s1, userSettings.identitySetting.email]
    ], function (err, results) { //
        if (err) {
            if (error)
                error += err;
            else
                error = err;
            imap_.end();
            return;
        }
        if (results.length == 0) {
            helper.log("No messages.");
            imap_.end();
            package.loadPackages();
            return;

        }
        helper.log("Found " + results.length + " message(s).");
        var f = imap_.fetch(results, {
            bodies: ''
        });
        f.on('message', function (msg, seqno) {
            //  helper.log('Message #' + seqno);
            var prefix = '(#' + seqno + ') ';
            msg.on('body', function (stream, info) {
                // console.log(prefix + 'Body');
                var path = helper.join(helper.getInboxPath(), 'msg-' + seqno + '-body-' + helper.generateGUID() + '.txt');
                try {
                    stream.pipe(fs.createWriteStream(path));
                } catch (err) {
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
                //.push(attrs.uid);
            });
            msg.once('end', function () {
                // helper.log(prefix + 'Finished recieving message ' + seqno + '.');
                redMessages++;
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
this.msgs = new Array();

function deleteMessages(msgs) {
    //helper.log("Deleting " + msgs.length + " message(s).");
    imap.msgs = msgs;
    try {
        var str = "Marking ";
        for (var i_ in msgs) {
            str += msgs[i_] + " ";
        }
        helper.log(str + "as DELETED");
        imap_.addFlags(msgs, 'Deleted', function (err) {
            if (err) {
                if (error)
                    error += err;
                else
                    error = err;
                helper.alert("Error deleteng message from server " + error);
                imap_.end();
                return;
            } else {

                imap_.expunge(imap.msgs, function (err) {
                    if (err) {
                        if (error)
                            error += err;
                        else
                            error = err;
                        helper.alert("Error deleteng message from server " + error);
                        imap_.end();
                        return;
                    } else {
                        helper.log("expunged.");


                        helper.log("Closing box.")
                        imap_.closeBox(true,
                            function (err) {
                                if (err) {
                                    if (error)
                                        error += err;
                                    else
                                        error = err;
                                    helper.alert("Error closing box on server! " + error);
                                    imap_.end();
                                    return;
                                } else {
                                    /*  if(redMessages>0)
                                         {
                                             var str = "Not all messages are expunged (" + redMessages.toString() + ")!";
                                             helper.log(str);
                                             helper.alert(str);
                                         }
                                             */
                                    ;
                                    imap_.end();
                                    package.loadPackages();
                                    imap.autoRecoveryCounter = 0;
                                    this.lastLoginWasSuccess = false;
                                }
                            });
                    }
                });
            }
        });
    } catch (err) {
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