// ==UserScript==
// @name Google Calendar - Keyboard shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Google%20Calendar%20-%20Keyboard%20Shortcuts.user.js
// @version 0.1.1
// @description Use Ctrl to highlight current day
// @match *://calendar.google.com/*
// @grant none
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyDown, true);
	window.addEventListener('keyup', keyUp, true);
	document.addEventListener("visibilitychange", visibilityChange);
}
function keyDown(key) {
	if (key.key == "Control")
		document.querySelector('.F262Ye').style.backgroundColor = 'red';
}
function keyUp(key) {
	if (key.key == "Control")
		document.querySelector('.F262Ye').style.backgroundColor = '';
}
function visibilityChange() {
	if (document.hidden)
		document.querySelector('.F262Ye').style.backgroundColor = '';
}
