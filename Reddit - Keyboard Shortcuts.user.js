// ==UserScript==
// @name Reddit - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @match https://www.reddit.com/subreddits/mine/*
// @grant none
// @version 0.1
// @downloadURL https://github.com/28064212/userscripts/raw/master/Reddit%20Keyboard%20Shortcuts.user.js
// @description u will hide all non-user rows, q will open link to submitted sorted by new
// ==/UserScript==

if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);

	let titles = document.querySelectorAll('.entry .titlerow');
	for (const t of titles) {
		let link = new URL(t.querySelector('a').href);
		if (link.pathname.startsWith('/user/')) {
			let newlink = document.createElement('a');
			newlink.textContent = '(New [Q])';
			newlink.href = link.href + 'submitted/?sort=new';
			newlink.classList.add('link-28064212');
			t.appendChild(newlink);
		}
	}
}

function keyShortcuts(key) {
	let code = key.keyCode;
	let ctrl = key.ctrlKey;
	let alt = key.altKey;
	let shift = key.shiftKey;
	let intext = (document.activeElement.nodeName == 'TEXTAREA' || (document.activeElement.nodeName == 'INPUT' && document.activeElement.type != 'checkbox') || document.activeElement.contentEditable == "true");
	if (!intext) {
		if (code == 81) {
			// Q - open new link
			let resSelected = document.querySelector('.res-selected');
			if (resSelected) {
				let link = resSelected.querySelector('.link-28064212');
				if (link)
					window.open(link);
			}
		}
		else if (code == 85) {
			// U - hide non-user rows
			let titles = document.querySelectorAll('.entry .titlerow');
			for (const t of titles) {
				let link = new URL(t.querySelector('a').href);
				if (!link.pathname.startsWith('/user/')) {
					t.parentElement.parentElement.remove();
				}
			}
		}
	}
}