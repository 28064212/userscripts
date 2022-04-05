// ==UserScript==
// @name MyFitnessPal - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @downloadURL https://github.com/28064212/userscripts/raw/master/MyFitnessPal%20-%20Keyboard%20Shortcuts.user.js
// @include /^https?://(www\.)?myfitnesspal\.com/food/add_to_diary\?.*/
// @include /^https?://(www\.)?myfitnesspal\.com/user/.*/diary/add\?.*/
// @match https://www.myfitnesspal.com/food/diary*
// @match https://www.myfitnesspal.com/food/search
// @version 1.4.2
// @description	a/z for up/down, q to select, w to select quantity, shift+d delete all
// ==/UserScript==

//from: https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
	let head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head)
		return;
	style = document.createElement('style');
	//style.innerHTML = css.replace(/;/g, ' !important;');
	style.innerHTML = css;
	head.appendChild(style);
}
let index = -1;
if (window.top == window.self) {
	addGlobalStyle(`.highlight436255 td {
			font-weight: bold !important;
			background-color: #00548F !important;
			color: white !important;
		}`);
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	const code = key.keyCode;
	const ctrl = key.ctrlKey;
	const alt = key.altKey;
	const shift = key.shiftKey;
	const intext = (document.activeElement.nodeName == 'TEXTAREA' || (document.activeElement.nodeName == 'INPUT' && document.activeElement.type != "checkbox" && document.activeElement.type != "submit"));
	let hl = document.querySelector('.highlight436255');
	if (ctrl && (code == 32)) {
		document.querySelector("#search").focus();
	}
	else if (!intext && (code == 37)) {
		// ←
		if (window.location.pathname.startsWith("/food/diary")) {
			document.querySelector(".prev").click();
		}
		else if (document.getElementById('recent').style.display != 'none') {
			if (!ctrl)
				document.querySelector('#recipes_tab a').click();
			else {
				const recents = document.querySelectorAll(".recent_page");
				let recent;
				for (const r of recents) {
					if (r.style.display != "none")
						recent = r;
				}
				recent.querySelector(".prev_page").click();
			}
		}
		else if (document.getElementById('frequent').style.display != 'none')
			document.querySelector('#recent_tab a').click();
		else if (document.getElementById('my_foods').style.display != 'none')
			document.querySelector('#frequent_tab a').click();
		else if (document.getElementById('meals').style.display != 'none')
			document.querySelector('#my_foods_tab a').click();
		else if (document.getElementById('recipes').style.display != 'none')
			document.querySelector('#meals_tab a').click();
	}
	else if (!intext && (code == 39)) {
		// →
		if (window.location.pathname.startsWith("/food/diary")) {
			document.querySelector(".next").click();
		}
		else if (document.getElementById('recent').style.display != 'none') {
			if (!ctrl)
				document.querySelector('#frequent_tab a').click();
			else {
				const recents = document.querySelectorAll(".recent_page");
				let recent;
				for (const r of recents) {
					if (r.style.display != "none")
						recent = r;
				}
				recent.querySelector(".next_page").click();
			}
		}
		else if (document.getElementById('frequent').style.display != 'none')
			document.querySelector('#my_foods_tab a').click();
		else if (document.getElementById('my_foods').style.display != 'none')
			document.querySelector('#meals_tab a').click();
		else if (document.getElementById('meals').style.display != 'none')
			document.querySelector('#recipes_tab a').click();
		else if (document.getElementById('recipes').style.display != 'none')
			document.querySelector('#recent_tab a').click();
	}
	else if (!ctrl && (code == 65 || code == 90)) {
		// a/z
		if (!intext || (document.activeElement && document.activeElement.id.startsWith("favorites_"))) {
			key.preventDefault();
			let list = [];
			if (document.getElementById('recipes').style.display != 'none')
				list = document.querySelectorAll('#recipes .favorite');
			else if (document.getElementById('frequent').style.display != 'none')
				list = document.querySelectorAll('#frequent .favorite');
			else if (document.getElementById('recent').style.display != 'none')
				list = document.querySelectorAll('#recent .favorite');
			else if (document.getElementById('meals').style.display != 'none')
				list = document.querySelectorAll('#meals .favorite');
			else if (document.getElementById('my_foods').style.display != 'none')
				list = document.querySelectorAll('#my_foods .favorite');
			if (hl != null)
				hl.classList.remove('highlight436255');
			if (hl == null || !isElementInViewport(hl))
				index = -1;
			if (index == -1) {
				if (code == 65) {
					if (shift)
						index = 0;
					else {
						for (let j = list.length - 1; j > 0 && index == -1; j--) {
							if (isElementInViewport(list[j]))
								index = j;
						}
						if (index == -1)
							index = list.length - 1;
					}
				}
				else if (code == 90) {
					if (shift)
						index = list.length - 1;
					else {
						for (let j = 0; j < list.length && index == -1; j++) {
							if (isElementInViewport(list[j]))
								index = j;
						}
						if (index == -1)
							index = 0;
					}
				}
			}
			else if (code == 65 && index > 0) {
				if (shift)
					index = 0;
				else
					index--;
			}
			else if (code == 90 && index < list.length - 1) {
				if (shift)
					index = list.length - 1;
				else
					index++;
			}
			list[index].classList.add('highlight436255');
			hl = document.getElementsByClassName('highlight436255')[0];
			if (!isElementInViewport(hl))
				hl.scrollIntoView(code == 90);
			hl.querySelector(".text").select();
		}
	}
	else if (code == 81 && hl != null) {
		// q - select
		hl.querySelector(".checkbox").click();
		key.preventDefault();
	}
	else if (code == 87 && hl != null) {
		// w - prevent muscle memory
		if (!intext || (document.activeElement && document.activeElement.id.startsWith("favorites_"))) {
			key.preventDefault();
		}
	}
	else if (!intext && shift && code == 68) {
		// shift+d - delete all
		if (window.confirm("Delete all?")) {
			let links = document.querySelectorAll('.delete a');
			if (links.length > 0) {
				for (let l of links) {
					window.open(l.href)
				}
			}
		}
	}
}
function isElementInViewport(el) {
	let rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
