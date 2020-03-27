// ==UserScript==
// @name Whatsapp - Keyboard Shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include https://web.whatsapp.com/
// @version 1.2.3
// @grant none
// @inject-into content
// ==/UserScript==

//v1.0.9 - use 'mousedown' instead of 'click'
//v1.0.9.2 - fix selection of first chat
//v1.0.9.4 - switch to alt+shift+↑/↓ to switch between chats
//v1.1 - fix for server-side changes, switch to just Alt for switching
//v1.1.1 - fix for using transforms instead of z-indexes for ordering 
//v1.1.2 - bugfix for transforms, refactoring
//v1.2 - fix for @inject-into directive
//v1.2.1 - bugfix
//v1.2.2 - serverside updates
//v1.2.3 - serverside updates

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
	if (alt && (code == 40 || code == 38)) {
		var chats = side.getElementsByClassName('_2wP_Y');
		var target = chats[0];
		if (side.getElementsByClassName('_1f1zm').length == 0) {
			var lowest = getIndex(chats[0]);
			for (var i = 1; i < chats.length; i++) {
				if (getIndex(chats[i]) < lowest)
					target = chats[i];
			}
		} else {
			var currentIndex = getIndex(side.getElementsByClassName('_1f1zm')[0].parentNode.parentNode);
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
		document.getElementsByClassName('_3xlwb')[0].focus();
	} else if (ctrl && code == 191) {
		//message box
		document.getElementsByClassName('_2WovP')[0].focus();
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
