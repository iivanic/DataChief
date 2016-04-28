
$(document).ready(function () {
    $("#btnSendRecieve").button({
        text: true,
        icons: {
            secondary: "ui-icon-refresh"
        }
    })
        .click(function () {
            filler.sendRecieve();
        });
});

this.sendRecieve = function () {

        imap.go();
    }
this.refreshFolders = function()
{
    // we need to refresh all folders
}