// ==UserScript==
// @name MyFitnessPal - Keyboard Shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/MyFitnessPal%20-%20Keyboard%20Shortcuts.user.js
// @include /^https?://(www\.)?myfitnesspal\.com/food/add_to_diary\?.*/
// @include /^https?://(www\.)?myfitnesspal\.com/user/.*/diary/add\?.*/
// @match https://www.myfitnesspal.com/food/diary*
// @match https://www.myfitnesspal.com/food/search
// @version 1.2.1
// @description	a/z for up/down, q to select, w to select quantity
// ==/UserScript==

//from: https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head)
		return;
	style = document.createElement('style');
	//style.innerHTML = css.replace(/;/g, ' !important;');
	style.innerHTML = css;
	head.appendChild(style);
}
if (window.top == window.self) {
	addGlobalStyle("\
		.highlight436255 {\n\
			border:red solid 2px !important;\n\
			font-weight: bold !important;\n\
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
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || (document.activeElement.nodeName == 'INPUT' && document.activeElement.type != "checkbox"));
	var hl = document.getElementsByClassName('highlight436255')[0];
	if (ctrl && (code == 32)) {
		document.getElementById("search").focus();
	}
	else if (!intext && (code == 37)) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		if(window.location.pathname.startsWith("/food/diary")) {
			document.querySelector(".prev").dispatchEvent(evt);
		}
		else if (document.getElementById('recent').style.display != 'none') {
			if (!ctrl)
				document.getElementById('recipes_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
			else {
				const recents = document.querySelectorAll(".recent_page");
				let recent;
				for (const r of recents) {
					if (r.style.display != "none")
						recent = r;
				}
				recent.querySelector(".prev_page").dispatchEvent(evt);
			}
		}
		else if (document.getElementById('frequent').style.display != 'none')
			document.getElementById('recent_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('my_foods').style.display != 'none')
			document.getElementById('frequent_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('meals').style.display != 'none')
			document.getElementById('my_foods_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('recipes').style.display != 'none')
			document.getElementById('meals_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
	}
	else if (!intext && (code == 39)) {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		if(window.location.pathname.startsWith("/food/diary")) {
			document.querySelector(".next").dispatchEvent(evt);
		}
		else if (document.getElementById('recent').style.display != 'none') {
			if (!ctrl)
				document.getElementById('frequent_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
			else {
				const recents = document.querySelectorAll(".recent_page");
				let recent;
				for (const r of recents) {
					if (r.style.display != "none")
						recent = r;
				}
				recent.querySelector(".next_page").dispatchEvent(evt);
			}
		}
		else if (document.getElementById('frequent').style.display != 'none')
			document.getElementById('my_foods_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('my_foods').style.display != 'none')
			document.getElementById('meals_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('meals').style.display != 'none')
			document.getElementById('recipes_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
		else if (document.getElementById('recipes').style.display != 'none')
			document.getElementById('recent_tab').getElementsByTagName('a')[0].dispatchEvent(evt);
	}
	else if (!intext && (code == 65 || code == 90)) {
		// a/z
		var list = [];
		if (document.getElementById('recipes').style.display != 'none')
			list = document.getElementById('recipes').getElementsByClassName('favorite');
		else if (document.getElementById('frequent').style.display != 'none')
			list = document.getElementById('frequent').getElementsByClassName('favorite');
		else if (document.getElementById('recent').style.display != 'none')
			list = document.getElementById('recent').getElementsByClassName('favorite');
		else if (document.getElementById('meals').style.display != 'none')
			list = document.getElementById('meals').getElementsByClassName('favorite');
		else if (document.getElementById('my_foods').style.display != 'none')
			list = document.getElementById('my_foods').getElementsByClassName('favorite');
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
		// q - select
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
		hl.getElementsByClassName("checkbox")[0].dispatchEvent(evt);
		hl.getElementsByClassName("checkbox")[0].focus();
		key.preventDefault();
	}
	else if (!intext && !ctrl && !alt && code == 87 && hl != null) {
		// w - focus textbox
		hl.getElementsByClassName("text")[0].select();
		key.preventDefault();
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
