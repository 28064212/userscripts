// ==UserScript==
// @name Whatsapp - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include https://web.whatsapp.com/
// @version 1.2.5
// @grant none
// @inject-into content
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
/*
	→ - 39
	← - 37
	Space - 32
	m - 77
	a - 65
	z - 90
	x - 88
	s - 83
	Enter - 13
	o - 79
	q - 81
	t - 84
	r - 82
	f - 70
	l - 76
	p - 80
	
	\ - 220
	/ - 191
	↑ - 38
	↓ - 40
	Del - 46
	` - 223
*/
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var shift = key.shiftKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var side = document.getElementById('pane-side');
	var chats = side.getElementsByClassName('_1MZWu');
	var activechat = side.getElementsByClassName('_1GGbM');
	var search = document.getElementsByClassName('_2Evw0')[0];
	var messagebox = document.getElementsByClassName('_1hRBM')[0];
	if (alt && (code == 40 || code == 38)) {
		var target = chats[0];
		if (activechat.length == 0) {
			var lowest = getIndex(chats[0]);
			for (var i = 1; i < chats.length; i++) {
				if (getIndex(chats[i]) < lowest)
					target = chats[i];
			}
		} else {
			var currentIndex = getIndex(activechat[0].parentNode.parentNode);
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
			target.firstChild.firstChild.dispatchEvent(event);
		}
	} else if (ctrl && code == 220) {
		//search
		search.click();
	} else if (ctrl && code == 191) {
		//message box
		messagebox.focus();
	}
}

function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}

function is_all_ws(nod) {
	return !(/[^\t\n\r ]/.test(nod.textContent));
}

function is_ignorable(nod) {
	return (nod.nodeType == 8) || // A comment node
		((nod.nodeType == 3) && is_all_ws(nod)) || // a text node, all ws
		(nod.firstChild.classList.contains('list-title'));
}

function node_before(sib) {
	while ((sib = sib.previousSibling)) {
		if (!is_ignorable(sib)) return sib;
	}
	return null;
}

function node_after(sib) {
	while ((sib = sib.nextSibling)) {
		if (!is_ignorable(sib)) return sib;
	}
	return null;
}

function getIndex(c) {
	var transform = c.style.transform;
	if (transform.indexOf('translateY') !== -1)
		return parseInt(transform.substring(transform.indexOf('Y(') + 2, transform.indexOf('px)')));
	else
		return parseInt(transform.substring(transform.indexOf('(0px, ') + 6, transform.indexOf(', 0px)') - 2));
}
