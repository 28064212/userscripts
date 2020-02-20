// ==UserScript==
// @name        MapMyRun Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @match       https://www.mapmyrun.com/routes/view/*
// @include     https://www.mapmyrun.com/workout/*
// @match       https://www.mapmyrun.com/routes/my_routes/
// @downloadURL https://github.com/28064212/userscripts/raw/master/MapMyRun%20Keyboard%20Shortcuts.user.js
// @version     1.3
// @grant       none
// ==/UserScript==
if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	if (code == 32 && ctrl) {
		// Ctrl+Space on workout edit to clear route and focus
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		document.getElementsByClassName("inner-2cIvZ")[0].dispatchEvent(evt);
		document.getElementsByClassName("routeSelector-25BXq")[0].getElementsByTagName("input")[0].focus();
		key.preventDefault();
	}
	else if (code == 83 && ctrl) {
		// Ctrl+S on workout edit to save
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		document.getElementsByClassName("saveButton-3fynd")[0].dispatchEvent(evt);
		key.preventDefault();
	}
	else if (code == 68 && ctrl) {
		// Ctrl+D on route view to delete
		// var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		// document.getElementsByClassName("delete_route")[0].dispatchEvent(evt);
		// key.preventDefault();
	}
	else if (code == 65 && ctrl) {
		// Ctrl+A on workout view to edit workout
		key.preventDefault();
		// if (document.getElementById("route_info") !== null)
			// window.open(document.getElementById("route_info").getElementsByTagName("a")[0].href);
		document.location = document.getElementById("workout_details_edit").href;
	}
	else if (code >= 49 && code <= 57) {
		// 1-9 to delete routes
		var dels = Array.prototype.slice.call(document.getElementsByTagName('a')).filter(el => el.textContent.trim() === 'Delete');
		var num = code - 49;
		if(dels.length > 0 && num + 1 <= dels.length) {
			dels[num].click();
		}
	}
	else if (code == 13) {
		// Enter to confirm deletion of route
		var oks = Array.prototype.slice.call(document.getElementsByTagName('span')).filter(el => el.textContent.trim() === 'OK');
		if(oks.length > 0) {
			oks[0].click();
		}
	}
}
