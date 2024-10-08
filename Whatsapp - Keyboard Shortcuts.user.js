// ==UserScript==
// @name Whatsapp - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include https://web.whatsapp.com/
// @version 1.3.5
// @grant none
// @inject-into content
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	let code = key.keyCode;
	let ctrl = key.ctrlKey;
	let alt = key.altKey;
	if (alt && (code == 40 || code == 38)) {
		let chats = document.querySelectorAll('#pane-side > div > div > div > div');
		let active = document.querySelector('#pane-side div[aria-selected="true"]') == null ? null : document.querySelector('#pane-side div[aria-selected="true"]').parentElement.parentElement;
		let target = chats[0];
		if (active == null) {
			let lowest = getIndex(chats[0]);
			for (let i = 1; i < chats.length; i++) {
				if (getIndex(chats[i]) < lowest)
					target = chats[i];
			}
		}
		else {
			let currentIndex = getIndex(active);
			let closest, checkIndex;
			for (let i = 0; i < chats.length; i++) {
				checkIndex = getIndex(chats[i]);
				if ((code == 40 && (checkIndex < closest || closest == undefined) && checkIndex > currentIndex) ||
					(code == 38 && (checkIndex > closest || closest == undefined) && checkIndex < currentIndex)) {
					closest = checkIndex;
					target = chats[i];
				}
			}
		}
		if (target != null) {
			let event = new MouseEvent('mousedown', {
				'bubbles': true,
				'cancelable': true
			});
			target.querySelector('img, span, button').parentElement.dispatchEvent(event);
		}
	}
	else if (ctrl && code == 220) {
		//search - ctrl+\
		let event = new MouseEvent('mousedown', {
			'bubbles': true,
			'cancelable': true
		});
		document.querySelector('#side button').dispatchEvent(event);
	}
	else if (ctrl && code == 191) {
		//message box - ctrl+/
		document.querySelector('footer .lexical-rich-text-input').focus();
	}
}
function getIndex(c) {
	let transform = c.style.transform;
	if (transform.indexOf('translateY') !== -1)
		return parseInt(transform.substring(transform.indexOf('Y(') + 2, transform.indexOf('px)')));
	else
		return parseInt(transform.substring(transform.indexOf('(0px, ') + 6, transform.indexOf(', 0px)') - 2));
}
