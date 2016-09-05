$(document).ready(function () {
    $("#collectortabs").tabs();
    $("#buttonCollectorExportFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-refresh"
        }
    })
        .click(function () {
            collector.displayForm()
        });
    $("#buttonCollectorDeleteFormData").button({
        text: true,
        icons: {
            secondary: "ui-icon-delete"
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
    helper.alert("delete form");
}
this.selectForm = function () {

}
