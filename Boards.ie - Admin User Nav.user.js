// ==UserScript==
// @name Boards.ie - Admin User Nav
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Navigate between users in the Admin CP
// @version 1.0.1
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Admin%20User%20Nav.user.js
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @include http://www.boards.ie/admin/u.php*
// ==/UserScript==

function getParameterByName(name)
{
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null)
	return "";
	else
	return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var userid = parseInt(getParameterByName("u"));

var prev = document.createElement("a");
prev.innerHTML = "Previous";
prev.href = "http://www.boards.ie/admin/u.php?do=edit&u=" + (userid - 1);
var next = document.createElement("a");
next.innerHTML = "Next";
next.href = "http://www.boards.ie/admin/u.php?do=edit&u=" + (userid + 1);
document.body.insertBefore(next, document.body.firstChild);
document.body.insertBefore(prev, document.body.firstChild);

window.addEventListener('keydown', pageNav, true);

function pageNav(key)
{
	if(key.keyCode == 39 && (document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT'))
		location.href = next.href;
	else if(key.keyCode == 37 && (document.activeElement.nodeName != 'TEXTAREA' && document.activeElement.nodeName != 'INPUT'))
		location.href = prev.href;
}
