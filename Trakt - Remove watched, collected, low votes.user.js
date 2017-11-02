// ==UserScript==
// @name        Trakt - Remove watched, collected, low votes
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Trakt%20-%20Remove%20watched,%20collected,%20low%20votes.user.js
// @description Remove watched, collected, low votes
// @include     http://trakt.tv/*
// @include     https://trakt.tv/*
// @version     1.4
// ==/UserScript==

//v1.1 Trakt v2 - use ctrl+Z to bring up buttons
//v1.2 Just remove on ctrl+Z, don't use buttons
//v1.3 https support

if(window.top == window.self)
{
	window.addEventListener('keydown', function(key) {
		var code = key.keyCode;
		var ctrl = key.ctrlKey;
		var alt = key.altKey;
		if(code == 90 && ctrl)
		{
			var x = document.getElementsByClassName("list selected");
			for(var i = 0; i < x.length; i++)
				x[i].parentNode.parentNode.parentNode.style.display = 'none';
			var x = document.getElementsByClassName("collect selected");
			for(var i = 0; i < x.length; i++)
				x[i].parentNode.parentNode.parentNode.style.display = 'none';
		}
	}, true);
}
