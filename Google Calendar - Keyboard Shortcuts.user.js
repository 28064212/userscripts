// ==UserScript==
// @name Google Calendar - Keyboard shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Google%20Calendar%20-%20Keyboard%20Shortcuts.user.js
// @version 0.1
// @description Use Ctrl to highlight current day
// @match *://calendar.google.com/*
// @grant none
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keydown, true);
	window.addEventListener('keyup', keyup, true);
}
function keydown(key) {
	if (key.key == "Control")
		document.querySelector('.F262Ye').style.backgroundColor = 'red';
}
function keyup(key) {
	if (key.key == "Control")
		document.querySelector('.F262Ye').style.backgroundColor = '';
}
