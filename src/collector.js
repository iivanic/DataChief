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
   $("#buttonCollectorExportDatabaseFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-cart"
        }
    })
        .click(function () {
            collector.displayForm()
        });
    $("#buttonCollectorDeleteDatabaseFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deleteForm()
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
this.exportDB = function()
{
    dataCollection.exportDB();
}
this.exportSentDB = function()
{
    dataCollection.exportSentDB();
}


