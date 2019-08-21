// ==UserScript==
// @name        MapMyRun Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @include     https://www.mapmyrun.com/workout/edit/*
// @match       https://www.mapmyrun.com/routes/view/*
// @version     1.0.0
// @grant       none
// ==/UserScript==
if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	key.preventDefault();
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	if (code == 32 && ctrl) {
		// Ctrl+Space on workout edit to clear route and focus
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		document.getElementsByClassName("inner-2cIvZ")[0].dispatchEvent(evt);
		document.getElementsByClassName("routeSelector-25BXq")[0].getElementsByTagName("input")[0].focus();
	}
	else if (code == 83 && ctrl) {
		// Ctrl+S on workout edit to save
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		document.getElementsByClassName("saveButton-3fynd")[0].dispatchEvent(evt);
	}
	else if (code == 68 && ctrl) {
		// Ctrl+D on route view to delete
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		document.getElementsByClassName("delete_route")[0].dispatchEvent(evt);
	}
}
