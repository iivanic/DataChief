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
            collector.displayForm()
        });
    $("#buttonCollectorDeleteFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deleteForm()
        });
   // ------------------
   $("#buttonCollectorExportSentFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-cart"
        }
    })
        .click(function () {
            collector.displayForm()
        });
    $("#buttonCollectorDeleteSentFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-trash"
        }
    })
        .click(function () {
            collector.deleteForm()
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
this.deleteForm = function () {
    helper.confirm("Delete forms in database? Make sure You have exported data to your database.", collector.deleteFormsConfirmed);
}
this.deleteFormsConfirmed = function (result)
{
    helper.deleteDatabase();
    helper.alert("Database deleted.");
}
this.selectForm = function () {

}

