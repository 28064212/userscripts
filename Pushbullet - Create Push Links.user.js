// ==UserScript==
// @name        Pushbullet - Create Push Links
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Pushbullet%20-%20Create%20Push%20Links.user.js
// @description Add links to individual pushes
// @include     https://www.pushbullet.com/
// @include     https://www.pushbullet.com/?*
// @version     1.1
// @grant       none
// ==/UserScript==

function addLinks()
{
	var divs = document.getElementsByClassName('push');
	for(var i = 0; i < divs.length; i++)
	{
		//console.log(divs[i].innerHTML)
		var st = divs[i].getElementsByClassName('small-text')[0];
		if(st != null)
		{
			var a = document.createElement('a');
			a.href = "?push_iden=" + divs[i].id.replace('push_', '');
			a.innerHTML = st.innerHTML;
			st.innerHTML = '';
			st.appendChild(a);
		}
	}
}
function loader()
{
	addLinks();
	var target = document.getElementsByClassName('push_cards')[0];
	var observer = new MutationObserver(function(mutations) {
			addLinks();
		});
	var config = { attributes: false, childList: true, characterData: false };
	observer.observe(target, config);
}
if(window.top == window.self)
{
	window.onload = loader;
}
