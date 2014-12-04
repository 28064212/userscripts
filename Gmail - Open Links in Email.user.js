// ==UserScript==
// @name Gmail - Open Links in Email
// @namespace https://github.com/28064212/greasemonkey-scripts
// @version 1.1.2
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Gmail%20-%20Open%20Links%20in%20Email.user.js
// @description Use the number keys (0-9) to open links in first email in conversation that has been opened. 1 opens first link, etc.
// @include https://mail.google.com/*
// @grant none
// ==/UserScript==

if(window.top == window.self)
{
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key)
{
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var shift = key.shiftKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT' || document.activeElement.contentEditable == "true");
	if(!ctrl && !alt && !shift && !intext && code >= 48 && code <= 57 && document.getElementsByClassName('a3s')[0] != null)
	{
		window.open(document.getElementsByClassName('a3s')[0].getElementsByTagName("a")[code == 48 ? 10 : code - 49]);
	}
}
