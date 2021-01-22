// ==UserScript==
// @name        Feedly - Keyboard Shortcuts
// @namespace   https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/Feedly%20-%20Keyboard%20Shortcuts.user.js
// @include	/^https?://(www\.)?feedly\.com/.*/
// @version     1.3
// @description	a/z for up/down, w to expand, q to view, ctrl+\ to hide sidebar
// ==/UserScript==

//from: https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) {
		console.log("a"); return;
	}
	console.log("b");
	style = document.createElement('style');
	style.type = 'text/css';
	//style.innerHTML = css.replace(/;/g, ' !important;');
	style.innerHTML = css
	head.appendChild(style);
}

if (window.top == window.self) {
	console.log("test");
	addGlobalStyle("\
		.fx .entry.u0{\n\
			margin-bottom:auto !important;\n\
		}\n\
		.highlight436255 {\n\
			border:red solid 1px !important;\n\
		}");

	window.addEventListener('keydown', keyShortcuts, true);
	var index = -1;
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
↑ - 38
↓ - 40
Del - 46
` - 223
 */
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var hl = document.getElementsByClassName('highlight436255')[0];
	if (!intext && (code == 65 || code == 90)) {
		// a/z - up/down
		var list = document.getElementById('feedlyPageFX').getElementsByClassName('entry');
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
	else if (!intext && !ctrl && !alt && code == 81 && hl != null) {
		// q - open in new tab
		window.open(hl.getElementsByClassName("entry__title")[0])
		hl.classList.add('highlight436255');
	}
	else if (!intext && !ctrl && !alt && code == 87 && hl != null) {
		// w - expand
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
		hl.dispatchEvent(evt);
		hl.classList.add('highlight436255');
	}
	else if (!intext && ctrl && !alt && code == 220) {
		if (document.getElementById('feedlyChrome__leftnav-wrapper').style.display != 'none') {
			document.getElementById('feedlyChrome__leftnav-wrapper').style.display = 'none';
			document.getElementById('feedlyChrome__leftnav-pin-wrapper').style.display = 'none';
			document.getElementById('feedlyFrame').style.marginLeft = '64px';
		}
		else {
			document.getElementById('feedlyChrome__leftnav-wrapper').style.display = 'block';
			document.getElementById('feedlyChrome__leftnav-pin-wrapper').style.display = 'block';
			document.getElementById('feedlyFrame').style.marginLeft = '384px';
		}
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
