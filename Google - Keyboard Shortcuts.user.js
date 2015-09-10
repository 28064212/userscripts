// ==UserScript==
// @name        Google - Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Google%20-%20Keyboard%20Shortcuts.user.js
// @include		/^https?://(www\.)?google\..*/search.*/
// @version     1.0.2
// @description	a/z for up/down, q to open, ctrl-space to focus search
// @grant		GM_addStyle
// ==/UserScript==

if(window.top == window.self)
{
	GM_addStyle("\
		.highlight436255 {\n\
			border:red solid 1px !important;\n\
		}");

	window.addEventListener('keydown', keyShortcuts, true);
	var index = -1;
}
/*
? - 39
? - 37
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
? - 38
? - 40
Del - 46
` - 223
 */
function keyShortcuts(key)
{
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var hl = document.getElementsByClassName('highlight436255')[0];
	if(!intext && (code == 65 || code == 90))
	{
		// a/z - up/down
		var list = document.getElementsByClassName('g');
		if(hl != null)
			hl.classList.remove('highlight436255');
		if(hl == null || !isElementInViewport(hl))
			index = -1;
		if(index == -1)
		{
			if(code == 65)
			{
				if(ctrl)
					index = 0;
				else
				{
					for(var j = list.length - 1; j > 0 && index == -1; j--)
					{
						if(isElementInViewport(list[j]))
							index = j;
					}
					if(index == -1)
						index = list.length - 1;
				}
			}
			else if(code == 90)
			{
				if(ctrl)
					index = list.length - 1;
				else
				{
					for(var j = 0; j < list.length && index == -1; j++)
					{
						if(isElementInViewport(list[j]))
							index = j;
					}
					if(index == -1)
						index = 0;
				}
			}
		}
		else if(code == 65 && index > 0)
		{
			if(ctrl)
				index = 0;
			else
				index--;
		}
		else if(code == 90 && index < list.length - 1)
		{
			if(ctrl)
				index = list.length - 1;
			else
				index++;
		}
		list[index].classList.add('highlight436255');
		hl = document.getElementsByClassName('highlight436255')[0];
		if(!isElementInViewport(hl))
			hl.scrollIntoView(code == 90);
		key.preventDefault();
	}
	else if(!intext && !ctrl && !alt && code == 81 && hl != null)
	{
		// q - open in new tab
		//var evt = document.createEvent("MouseEvents");
		//evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, true, false, false, false, 0, null);
		//hl.parentNode.parentNode.parentNode.getElementsByClassName('condensedTools')[0].getElementsByTagName('a')[0].dispatchEvent(evt);
		//hl.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('inlineFrame')[0].getElementsByTagName('a')[0].dispatchEvent(evt);
		window.open(hl.getElementsByTagName('a')[0]);
		//hl.classList.add('highlight436255');
	}
	else if(!intext && !ctrl && !alt && code == 39)
	{
		window.location.href = document.getElementById('pnnext');
	}
	else if(!intext && !ctrl && !alt && code == 37)
	{
		window.location.href = document.getElementById('pnprev');
	}
	else if(!intext && ctrl && code == 32)
	{
		document.getElementsByName('q')[0].select();
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
