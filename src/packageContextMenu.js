var CLIPBOARD = "";
function bindPackageContextMenu()
{
    $(document).contextmenu({
		delegate: ".hasmenu",
		preventContextMenuForPopup: true,
		preventSelect: true,
		taphold: true,
		menu: [
			{title: "Cut <kbd>Ctrl+X</kbd>", cmd: "cut", uiIcon: "ui-icon-scissors"},
			{title: "Copy <kbd>Ctrl+C</kbd>", cmd: "copy", uiIcon: "ui-icon-copy"},
			{title: "Paste <kbd>Ctrl+V</kbd>", cmd: "paste", uiIcon: "ui-icon-clipboard", disabled: true },
			{title: "----"},
			{title: "More", children: [
				{title: "Sub 1 (using callback)", action: function(event, ui) { alert("action callback sub1");} },
				{title: "Sub 2 with a long title<kbd>[F2]</kbd>", cmd: "sub2"},
				{title: "Sub 3 <label>Please select: <input type='checkbox' name='sub2'></label>", cmd: "sub3"}
				]}
			],
		// Handle menu selection to implement a fake-clipboard
		select: function(event, ui) {
			var $target = ui.target;
			switch(ui.cmd){
			case "copy":
				CLIPBOARD = $target.text();
				break
			case "paste":
				CLIPBOARD = "";
				break
			}
			alert("select " + ui.cmd + " on " + $target.text());
			// Optionally return false, to prevent closing the menu now
		},
		// Implement the beforeOpen callback to dynamically change the entries
		beforeOpen: function(event, ui) {
			var $menu = ui.menu,
				$target = ui.target,
				extraData = ui.extraData; // passed when menu was opened by call to open()

			// console.log("beforeOpen", event, ui, event.originalEvent.type);

			ui.menu.zIndex( $(event.target).zIndex() + 1);

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