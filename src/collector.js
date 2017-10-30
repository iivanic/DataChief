$(document).ready(function () {
    $("#collectortabs").tabs();
    $("#collectorRecievedBroadcastsTabs").tabs();
    
    $("#buttonCollectorExportFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-cart"
        }
    })
        .click(function () {
            collector.exportDB()
        });
    $("#buttonCollectorDeleteFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deleteDBForms()
        });
   // ------------------
   $("#buttonCollectorExportSentFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-cart"
        }
    })
        .click(function () {
            collector.exportSentDB()
        });
    $("#buttonCollectorDeleteSentFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deleteSentForms()
        });
  // ------------------
   $("#buttonCollectorExportBroadcastFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-cart"
        }
    })
        .click(function () {
            collector.exportBroadcastDB()
        });
    $("#buttonCollectorDeleteBroadcastFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deletBroadcastForms()
        });
    $("#selectCollectorChooseForm").selectmenu().click(function () {
        collector.selectForm()
    });

}
);

this.displayForm = function () {
    helper.alert("display form");
}
this.deleteDBForms = function () {
    helper.confirm("Delete forms in database? Make sure You have exported data to your database.", collector.deleteDBFormsConfirmed);
}
this.deleteSentForms = function () {
    helper.confirm("Delete forms in Sent folder? Make sure You have exported sent folder to your database.", collector.deleteSentFormsConfirmed);
}
this.deletBroadcastForms = function () {
    helper.confirm("Delete all broadcasted forms? Make sure You have exported Broadcast folder to your database.", collector.deleteBroadcastConfirmed);
}
this.deleteDBFormsConfirmed = function (result)
{
    helper.deleteDatabase();
    helper.alert("Database deleted.");
}
this.deleteSentFormsConfirmed = function (result)
{
    helper.deleteSentFolder();
    helper.alert("Sent folder deleted.");
}
this.deleteBroadcastConfirmed = function (result)
{
    helper.deleteBroadcastFolder();
    helper.alert("Sent folder deleted.");
}

this.exportDB = function()
{
    dataCollection.exportDB();
}
this.exportSentDB = function()
{
    dataCollection.exportSentDB();
}
this.exportBroadcastDB = function()
{
    dataCollection.exportBroadcastDB();
}


