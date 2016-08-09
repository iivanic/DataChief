var cmds = [
    { name: "empty", description: 'Empty command' },
    { name: "delete", description: 'Delete all local copies from publisher' },
    { name: "text", description: 'Sends text message to users' }
];

this.ctor = function (command, textmessage) {
    this.command = command;
    this.textmessage = textmessage;
    this.publisher = userSettings.organization;
}

this.run = function () {
    switch (command.name) {
        case "empty":
            break;
        case "delete":
            helper.alert("TODO: This command should delete every filled or half filled form(sent forms folder, outbox folder, work folder, recieved folder) from this publisher (" 
                + this.publisher +
                "). This can be usefull when employee is leaving organization or organization internal security policy changes.");
                break;
        case "text":
            helper.alert(this.textmessage);
            break;
    }
}