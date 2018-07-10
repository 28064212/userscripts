// ==UserScript==
// @name Webtoons.com - Keyboard Shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @version 1.0
// @description Left/right arrow keys for navigation
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Webtoons.com%20-%20Keyboard%20Shortcuts.user.js
// @include /^https?://(www\.)?webtoons\.com/.*/
// ==/UserScript==

if(window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
/*
→ - 39
← - 37
 */
function keyShortcuts(key)
{
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	if(code == 39 && !intext && document.getElementsByClassName("pg_next")[0] != null) {
		// => - increase page
		location.href = document.getElementsByClassName("pg_next")[0];
	}
	else if(code == 37 && !intext && document.getElementsByClassName("pg_prev")[0] != null) {
		// => - decrease page
		location.href = document.getElementsByClassName("pg_prev")[0];
	}
}
