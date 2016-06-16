var CLIPBOARD = "";
function bindPackageContextMenu() {
    $(document).contextmenu({
		delegate: ".hasmenu",
		preventContextMenuForPopup: true,
		preventSelect: true,
		taphold: true,
		menu: [
			//	{title: "Cut <kbd>Ctrl+X</kbd>", cmd: "cut", uiIcon: "ui-icon-scissors"},

			{ title: "Delete", cmd: "delete", uiIcon: "ui-icon-trash" },
			{ title: "----" },
			{
				title: "Add Command to package", uiIcon: "ui-icon-script", children: [

					{ title: "Revoke published templates", uiIcon: "ui-icon-close", cmd: "revoke" },
					{ title: "Delete local copies", uiIcon: "ui-icon-cancel", cmd: "deletelocalcopies" },
					{ title: "Send message", uiIcon: "ui-icon-note", cmd: "message" }
				]
			}
		],
		// Handle menu selection to implement a fake-clipboard
		select: function (event, ui) {
			var $target = ui.target;
			switch (ui.cmd) {
				case "delete":
					CLIPBOARD = $target.text();
					break
				case "revoke":
					CLIPBOARD = "";
					break;
				case "deletelocalcopies":
					CLIPBOARD = "";
					break;
				case "message":
					CLIPBOARD = "";
					break;
			}
			alert("select " + ui.cmd + " on " + $target.text());
			// Optionally return false, to prevent closing the menu now
		},
		// Implement the beforeOpen callback to dynamically change the entries
		beforeOpen: function (event, ui) {
			var $menu = ui.menu,
				$target = ui.target,
				extraData = ui.extraData; // passed when menu was opened by call to open()

			// console.log("beforeOpen", event, ui, event.originalEvent.type);

			ui.menu.zIndex($(event.target).zIndex() + 1);

			$(document)
				//				.contextmenu("replaceMenu", [{title: "aaa"}, {title: "bbb"}])
				//				.contextmenu("replaceMenu", "#options2")
				//				.contextmenu("setEntry", "cut", {title: "Cuty", uiIcon: "ui-icon-heart", disabled: true})
				.contextmenu("setEntry", "copy", "Copy '" + $target.text() + "'")
				.contextmenu("setEntry", "paste", "Paste" + (CLIPBOARD ? " '" + CLIPBOARD + "'" : ""))
				.contextmenu("enableEntry", "paste", (CLIPBOARD !== ""));

			// Optionally return false, to prevent opening the menu now
		}
	});
}