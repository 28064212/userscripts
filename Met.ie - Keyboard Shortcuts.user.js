// ==UserScript==
// @name        Met.ie - Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @match       https://www.met.ie/
// @downloadURL https://github.com/28064212/userscripts/raw/master/Met.ie%20-%20Keyboard%20Shortcuts.user.js
// @version     0.1
// @grant       none
// ==/UserScript==
if (window.top == window.self) {
	window.addEventListener('keydown', keyShortcuts, true);
}
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var slider = document.getElementsByClassName('vue-slider')[0];
	var dots = document.getElementsByClassName('vue-slider-piecewise-item');
	var maxPos = dots.length - 1;
	var currPx = document.getElementsByClassName('vue-slider-always')[0].style.transform.replace('translateX(', '').replace('px)', '');
	var currPos = maxPos
	for (var i = 0; i <= maxPos; i++) {
		if (Math.abs(dots[i].style.left.replace('px', '') - currPx) < 2)
			currPos = i;
	}
	if (code == 39 && currPos < maxPos) {
		// Right
		var rect = dots[currPos + 1].getBoundingClientRect();
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true, clientX: rect.x + 5, clientY: rect.y + 5 });
		slider.dispatchEvent(evt);
		currPos++;
	}
	else if (code == 37 && currPos > 0) {
		// Left
		var rect = dots[currPos - 1].getBoundingClientRect();
		var evt = new MouseEvent("click", { bubbles: true, cancelable: true, clientX: rect.x + 5, clientY: rect.y + 5 });
		slider.dispatchEvent(evt);
		currPos--;
	}
}
