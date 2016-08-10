exports.cmds = [
        { id: "0", name: "", description: '<-- Choose command -->' },
        { id: "1", name: "empty", description: 'Empty command' },
        { id: "2", name: "delete", description: 'Delete all local copies from publisher' },
        { id: "3", name: "text", description: 'Sends text message to users' }
    ];

this.findCommand = function(id)
{
    return exports.cmds[Math.abs(id)];
}

this.ctor = function (command, textmessage) {
    this.command = command;
    this.textmessage = textmessage;
    this.publisher = userSettings.organization;

}

this.run = function () {
    switch (this.command.name) {
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