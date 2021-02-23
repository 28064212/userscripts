// ==UserScript==
// @name        Garmin - Keyboard Shortcuts
// @namespace   https://github.com/28064212/userscripts
// @match       https://connect.garmin.com/*
// @downloadURL https://github.com/28064212/userscripts/raw/master/Garmin%20-%20Keyboard%20Shortcuts.user.js
// @version     1.1
// @grant       none
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	if (code >= 49 && code <= 57 && window.location.href.includes('/activities')) {
		// 1-9 to open workouts
		key.preventDefault();
		var workouts = document.querySelectorAll('.activity-name-edit .inline-edit-target');
		var num = code - 49;
		if (workouts.length > 0 && num + 1 <= workouts.length) {
			navigator.clipboard.writeText(workouts[num].href);
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: ctrl });
			workouts[num].dispatchEvent(evt);
		}
	}
}
