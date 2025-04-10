// ==UserScript==
// @name Google - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/Google%20-%20Keyboard%20Shortcuts.user.js
// @include /^https?://(www\.)?google\..*/search.*/
// @version 1.6.3
// @description	a/z for up/down, q to open, ctrl-space to focus search
// ==/UserScript==
function addGlobalStyle(css) {
	//from: https://stackoverflow.com/a/46285637
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		return;
	}
	style = document.createElement('style');
	style.innerHTML = css
	head.appendChild(style);
}
function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	var styles = window.getComputedStyle(el);
	var visibility = styles.getPropertyValue('visibility');
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth) &&
		visibility != 'hidden'
	);
}
var index = -1;
if (window.top == window.self) {
	addGlobalStyle("\
		.highlight436255 {\n\
			border:red solid 1px !important;\n\
		}");
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	const code = key.keyCode;
	const ctrl = key.ctrlKey;
	const alt = key.altKey;
	const intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	const isch = location.toString().indexOf('tbm=isch') >= 0; // image search
	let hl = document.getElementsByClassName('highlight436255')[0];
	if (!isch && !intext && (code == 65 || code == 90)) {
		// a/z - up/down
		var list;
		if (document.querySelector('#rso > script[nonce]'))
			list = document.querySelectorAll('#rso > div:first-child, #rso > div:last-child > div:not(:empty)');
		else
			list = document.querySelectorAll('#rso > div:not(:empty)');
		if (list.length <= 1)
			list.
				list = Array.from(list).filter(l => l.offsetParent != null);
		if (hl != null)
			hl.classList.remove('highlight436255');
		if (hl == null || !isElementInViewport(hl))
			index = -1;
		if (index == -1) {
			if (code == 65) {
				if (ctrl)
					index = 0;
				else {
					for (var j = list.length - 1; j > 0 && index == -1; j--) {
						if (isElementInViewport(list[j]))
							index = j;
					}
					if (index == -1)
						index = list.length - 1;
				}
			}
			else if (code == 90) {
				if (ctrl)
					index = list.length - 1;
				else {
					for (var j = 0; j < list.length && index == -1; j++) {
						if (isElementInViewport(list[j]))
							index = j;
					}
					if (index == -1)
						index = 0;
				}
			}
		}
		else if (code == 65 && index > 0) {
			if (ctrl)
				index = 0;
			else
				index--;
		}
		else if (code == 90 && index < list.length - 1) {
			if (ctrl)
				index = list.length - 1;
			else
				index++;
		}
		list[index].classList.add('highlight436255');
		hl = document.getElementsByClassName('highlight436255')[0];
		if (!isElementInViewport(hl))
			hl.scrollIntoView(code == 90);
		key.preventDefault();
	}
	else if (!isch && !intext && !ctrl && !alt && code == 81 && hl != null) {
		// q - open in new tab
		window.open(hl.getElementsByTagName('a')[0]);
	}
	else if (!isch && !intext && !ctrl && !alt && code == 39) {
		window.location.href = document.getElementById('pnnext');
	}
	else if (!isch && !intext && !ctrl && !alt && code == 37) {
		window.location.href = document.getElementById('pnprev');
	}
	else if (!intext && ctrl && code == 32) {
		document.getElementsByName('q')[0].select();
	}
}
