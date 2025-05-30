// ==UserScript==
// @name        Garmin - Keyboard Shortcuts
// @namespace   https://github.com/28064212/userscripts
// @match       https://connect.garmin.com/*
// @downloadURL https://github.com/28064212/userscripts/raw/master/Garmin%20-%20Keyboard%20Shortcuts.user.js
// @version     1.2.4
// @grant       none
// ==/UserScript==
if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	let code = key.keyCode;
	const ctrl = key.ctrlKey;
	const alt = key.altKey;
	if ((code == 13 || (code >= 49 && code <= 57)) && window.location.href.includes('/activities') && !ctrl) {
		// 1/Enter-9 to open workouts
		key.preventDefault();
		const workouts = document.querySelectorAll('a[href*="/activity/"]');
		code = code == 13 ? 49 : code; // set enter = 1
		const num = code - 49;
		if (workouts.length > 0 && num + 1 <= workouts.length) {
			navigator.clipboard.writeText(workouts[num].href);
			const evt = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: ctrl });
			workouts[num].dispatchEvent(evt);
		}
	}
	else if (code == 13 && document.querySelector('.weight')) {
		// Enter - add weight
		const buttons = document.querySelectorAll("button");
		const save = document.querySelector("[class*='WeightPage_actionButtonsContainer'] button:last-child");
		if (save.disabled) {
			for (let b of buttons) {
				if (b.innerText == "Add Weight") {
					b.focus();
					b.click();
					break;
				}
			}
			const input = document.querySelector("[class^='WeightPage_weightInputContainer'] input");
			input.focus();
		}
		else {
			save.click();
		}
	}
}
