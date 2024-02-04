// ==UserScript==
// @name        MapMyRun Keyboard Shortcuts
// @namespace   https://github.com/28064212/userscripts
// @match       https://www.mapmyrun.com/routes/view/*
// @match       https://www.mapmyrun.com/workout/*
// @match       https://www.mapmyrun.com/routes/my_routes/
// @match       https://www.mapmyrun.com/activity_feed*
// @downloadURL https://github.com/28064212/userscripts/raw/master/MapMyRun%20Keyboard%20Shortcuts.user.js
// @version     1.5.3
// @grant       none
// ==/UserScript==

var routeSelector = '[class^="routeSelector"]';
if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	if (code == 13 && window.location.href.indexOf('/edit/') != -1 && document.activeElement.nodeName.toLowerCase() != 'input' && document.activeElement.nodeName.toLowerCase() != 'textarea') {
		// Enter on workout edit to focus on route (or note if route is selected already)
		if (document.querySelector('[class*="selectedRoute"]') == null) {
			// no route selected yet, so focus on it
			document.querySelector(routeSelector + ' input').focus();
		}
		else {
			// focus on the notes
			document.querySelector('textarea').focus();
			document.querySelector('textarea').scrollIntoView();
		}
		key.preventDefault();
	}
	else if (code == 83 && ctrl) {
		// Ctrl+S on workout edit to save
		document.querySelector('[class*="saveButtonContainer"] button').click()
		key.preventDefault();
	}
	else if (code == 13 || (code >= 49 && code <= 57)) {
		if (window.location.href.indexOf('/workout/') != -1 && window.location.href.indexOf('/edit/') == -1) {
			// 1-9 to view workout
			navigator.clipboard.writeText(window.location.toString());
			document.location = window.location.toString().replace("workout", "workout/edit");
		}
		else if (window.location.href.indexOf('activity_feed') != -1) {
			// 1-9 to open workouts
			key.preventDefault();
			var workouts = document.querySelectorAll('[class^="row-"]');
			code = code == 13 ? 49 : code; // set enter = 1
			var num = code - 49;
			if (workouts.length > 0 && num + 1 <= workouts.length) {
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: ctrl });
				workouts[num].getElementsByTagName("a")[0].dispatchEvent(evt);
			}
		}
		else {
			if (document.activeElement.nodeName !== "INPUT") {
				var oks = Array.prototype.slice.call(document.getElementsByTagName('span')).filter(el => el.textContent.trim() === "Yes, I'm Sure");
				if (oks.length > 0) {
					// confirm deletion
					oks[0].click();
				}
				else {
					// 1/Enter-9 to delete routes
					var dels = document.querySelectorAll('[aria-label="Route Actions"]');
					code = code == 13 ? 49 : code; // set enter = 1
					var num = code - 49;
					if (dels.length > 0 && num + 1 <= dels.length) {
						const title = dels[num].parentElement.parentElement.firstElementChild.innerText;
						if (title.indexOf("Route from Garmin Connect") === 0 || window.confirm(title + "\n\nNot a route from Garmin, proceed?")) {
							const config = { attributes: false, childList: true, subtree: false };
							const observer = new MutationObserver(callback);
							observer.observe(document.body, config);
							dels[num].click();
						}
					}
				}
			}
		}
	}
}
function callback(mutationList, observer) {
	Array.prototype.slice.call(document.getElementsByTagName('span')).filter(el => el.textContent.trim() === "Delete")[0].click();
	observer.disconnect();
}