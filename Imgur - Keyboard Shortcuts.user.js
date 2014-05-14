// ==UserScript==
// @name Imgur - Keyboard Shortcuts
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Display notification count in page/tab title
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Imgur%20-%20Keyboard%20Shortcuts.user.js
// @version 1.2
// @include /^https?://(www\.)?imgur\.com/.*/
// ==/UserScript==

//v1.0 - created
//v1.1 - use q for album expand
//v1.2 - use 1-9/0 to open links in comments, use z on front-page to get to first image

//a - 65
//z - 90
//x - 88 - expand comment
//\ - 220 - first image, mouseover
//q - 81 - expand album

if(window.top == window.self)
{
	GM_addStyle("\
		.highlight436255 {\n\
			border:red solid 1px !important;\n\
		}");

	window.addEventListener('keydown', keyShortcuts, true);
	var index = -1;
	
	var target = document.getElementById("image-title");	
	var observer = new MutationObserver(function(mutations) {
		index = -1;
	});
	var config = { attributes: false, childList: true, characterData: false };
	observer.observe(target, config);
}
function keyShortcuts(key)
{
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var hl = document.getElementsByClassName('highlight436255')[0];
    if(!intext && document.getElementById('imagelist') != null && code == 90)
	{
		window.location = document.getElementById('imagelist').getElementsByClassName('posts')[0].getElementsByTagName('a')[0].href;
	}
	else if(!intext && (code == 65 || code == 90))
	{
		// a/z - navigate forums/threads
		var comments = document.getElementsByClassName('comment');
		var list = Array.prototype.filter.call(comments, function(comment){
				return comment.offsetParent !== null;
				//return (comment.parentNode.parentNode.style.display !== 'none' && comment.parentNode.style.display !== 'none' && comment.style.display !== 'none');
			});
		if(hl == null)
		{
			if(code == 65)
			{
				if(ctrl)
				{
					index = 0;
					key.preventDefault();
				}
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
				{
					index = list.length - 1;
					key.preventDefault();
				}
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
			{
				index = 0;
				key.preventDefault();
			}
			else
				index--;
		}
		else if(code == 90 && index < list.length - 1)
		{
			if(ctrl)
			{
				index = list.length - 1;
				key.preventDefault();
			}
			else
				index++;
		}
		if(hl != null)
			hl.classList.remove('highlight436255');
		if(hl != null && hl.getElementsByClassName('usertext')[0].getElementsByClassName('image-link')[0] != null)
		{
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("mouseout", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			hl.getElementsByClassName('usertext')[0].getElementsByClassName('image-link')[0].dispatchEvent(evt);
		}
		list[index].classList.add('highlight436255');
		hl = document.getElementsByClassName('highlight436255')[0];
		if(!isElementInViewport(hl))
			hl.scrollIntoView(code == 90);
	}
	else if(!intext && !ctrl && code == 88)
	{
		if(hl.getElementsByClassName('expand')[0] != null)
		{
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			hl.getElementsByClassName('expand')[0].dispatchEvent(evt);
		}
	}
	else if(!intext && !ctrl && code == 220)
	{
		if(hl.getElementsByClassName('usertext')[0].getElementsByClassName('image-link')[0] != null)
		{
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("mouseover", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			hl.getElementsByClassName('usertext')[0].getElementsByClassName('image-link')[0].dispatchEvent(evt);
		}
	}
	else if(!intext && !ctrl && code == 81)
	{
		if(document.getElementById('album-truncated') != null)
		{
			var evt = document.createEvent("MouseEvents");
			evt.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
			document.getElementById('album-truncated').getElementsByTagName('a')[0].dispatchEvent(evt);
		}
    }
	else if(!intext && !ctrl && hl != null && code >= 48 && code <= 57)
	{
        if(hl.getElementsByClassName('usertext')[0].getElementsByTagName('a')[code == 48 ? 10 + 2 : code - 49 + 2] != null)
            window.open(hl.getElementsByClassName('usertext')[0].getElementsByTagName('a')[code == 48 ? 10 + 2 : code - 49 + 2]);
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
