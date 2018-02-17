// ==UserScript==
// @name	Whatsapp - Keyboard Shortcuts
// @namespace	https://github.com/28064212/greasemonkey-scripts
// @downloadURL	https://github.com/28064212/greasemonkey-scripts/raw/master/Whatsapp%20-%20Keyboard%20Shortcuts.user.js
// @include	https://web.whatsapp.com/
// @version	1.1.1
// @grant	none
// ==/UserScript==

//v1.0.9 - use 'mousedown' instead of 'click'
//v1.0.9.2 - fix selection of first chat
//v1.0.9.4 - switch to alt+shift+↑/↓ to switch between chats
//v1.1 - fix for server-side changes, switch to just Alt for switching
//v1.1.1 - fix for using transforms instead of z-indexes for ordering 

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
	/ - 191
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
	if(alt && (code == 40 || code == 38))
	{
		var chats = side.firstChild.firstChild.firstChild.getElementsByTagName('div');
		var target = chats[0];
		if(side.getElementsByClassName('_1f1zm').length == 0)
		{
			var transform = chats[0].style.transform;
			var lowest = parseInt(transform.substring(transform.indexOf('(0px, ')+6,transform.indexOf(', 0px)')-2));
			for(var i = 1; i < chats.length; i++)
			{
				transform = chats[i].style.transform;
				if(lowest > parseInt(transform.substring(transform.indexOf('(0px, ')+6,transform.indexOf(', 0px)')-2)))
				{
					lowest = parseInt(transform.substring(transform.indexOf('(0px, ')+6,transform.indexOf(', 0px)')-2));
					target = chats[i];
				}
			}
		}
		else
		{
			var transform = side.getElementsByClassName('_1f1zm')[0].parentNode.parentNode.style.transform;
			var currentIndex = parseInt(transform.substring(transform.indexOf('(0px, ')+6,transform.indexOf(', 0px)')-2));
			var closest;
			var transformi, indexi;
			for(var i = 0; i < chats.length; i++)
			{
				transformi = chats[i].style.transform;
				indexi = parseInt(transformi.substring(transformi.indexOf('(0px, ')+6,transformi.indexOf(', 0px)')-2));
				if((code == 40 && (indexi < closest || closest == undefined) && indexi > currentIndex) ||
					(code == 38 && (indexi > closest || closest == undefined) && indexi < currentIndex))
				{
					closest = indexi;
					target = chats[i];
				}
			}
		}
		if(target != null)
		{
			// var evt = document.createEvent("MouseEvents");
			// evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			// target.firstChild.dispatchEvent(evt);
			// target.getElementsByClassName("chat")[0]
			var event = new MouseEvent('mousedown', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
			target.firstChild.firstChild.dispatchEvent(event);
		}
	}
	else if(ctrl && code == 220)
	{
		document.getElementById('input-chatlist-search').focus();
	}
	else if(ctrl && code == 191)
	{
		document.getElementsByClassName('pluggable-input-body')[0].focus();
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
