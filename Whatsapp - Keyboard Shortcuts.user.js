// ==UserScript==
// @name Whatsapp - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include https://web.whatsapp.com/
// @version 1.3.4
// @grant none
// @inject-into content
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	if (alt && (code == 40 || code == 38)) {
		var chats = document.querySelectorAll('#pane-side > div > div > div > div');
		var active = document.querySelector('div[aria-selected="true"]') == null ? null : document.querySelector('div[aria-selected="true"]').parentElement.parentElement;
		var target = chats[0];
		if (active == null) {
			var lowest = getIndex(chats[0]);
			for (var i = 1; i < chats.length; i++) {
				if (getIndex(chats[i]) < lowest)
					target = chats[i];
			}
		}
		else {
			var currentIndex = getIndex(active);
			var closest, checkIndex;
			for (var i = 0; i < chats.length; i++) {
				checkIndex = getIndex(chats[i]);
				if ((code == 40 && (checkIndex < closest || closest == undefined) && checkIndex > currentIndex) ||
					(code == 38 && (checkIndex > closest || closest == undefined) && checkIndex < currentIndex)) {
					closest = checkIndex;
					target = chats[i];
				}
			}
		}
		if (target != null) {
			var event = new MouseEvent('mousedown', {
				'bubbles': true,
				'cancelable': true
			});
			target.querySelector('img, span, button').parentElement.dispatchEvent(event);
		}
	}
	else if (ctrl && code == 220) {
		//search - ctrl+\
		var event = new MouseEvent('mousedown', {
			'bubbles': true,
			'cancelable': true
		});
		document.querySelector('#side button:first-child').dispatchEvent(event);
	}
	else if (ctrl && code == 191) {
		//message box - ctrl+/
		document.querySelector('footer > div > div:nth-child(2)').focus();
	}
}
function getIndex(c) {
	var transform = c.style.transform;
	if (transform.indexOf('translateY') !== -1)
		return parseInt(transform.substring(transform.indexOf('Y(') + 2, transform.indexOf('px)')));
	else
		return parseInt(transform.substring(transform.indexOf('(0px, ') + 6, transform.indexOf(', 0px)') - 2));
}
