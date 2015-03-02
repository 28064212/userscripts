// ==UserScript==
// @name        Whatsapp - Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include     https://web.whatsapp.com/
// @version     1.0.2
// @grant		none
// ==/UserScript==

if(window.top == window.self)
{
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
↑ - 38
↓ - 40
Del - 46
` - 223
 */
function keyShortcuts(key)
{
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var shift = key.shiftKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var side = document.getElementById('pane-side');
	if(ctrl && (code == 40 || code == 38))
	{
		var target;
		if(side.getElementsByClassName('active').length == 0)
			target = document.getElementsByClassName('chat')[0].parentNode;
		else
		{
			if(code == 40)
				target = node_after(side.getElementsByClassName('active')[0].parentNode);
			else
				target = node_before(side.getElementsByClassName('active')[0].parentNode);
		}
		if(target != null)
		{
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			target.firstChild.dispatchEvent(evt);
		}
	}
	else if(ctrl && !shift && code == 37)
	{
		document.getElementsByClassName('input-search')[0].focus();
	}
	else if(ctrl && !shift && code == 39)
	{
		document.getElementById('compose-input').focus();
	}
}
function isElementInViewport (el) {
	var rect = el.getBoundingClientRect();
	return (
			rect.top >= 0 &&
			rect.left >= 0 &&
			rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
function is_all_ws( nod )
{
	return !(/[^\t\n\r ]/.test(nod.textContent));
}
function is_ignorable( nod )
{
	return ( nod.nodeType == 8) || // A comment node
	( (nod.nodeType == 3) && is_all_ws(nod) ) || // a text node, all ws
	( nod.firstChild.classList.contains('list-title') );
}
function node_before( sib )
{
	while ((sib = sib.previousSibling)) {
		if (!is_ignorable(sib)) return sib;
	}
	return null;
}
function node_after( sib )
{
	while ((sib = sib.nextSibling)) {
		if (!is_ignorable(sib)) return sib;
	}
	return null;
}
