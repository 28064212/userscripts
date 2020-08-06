// ==UserScript==
// @name Boards.ie - Notification in Title
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Display notification count in page/tab title
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Notification%20in%20Title.user.js
// @version 1.2.1
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @include http://www.boards.ie/*
// @include https://www.boards.ie/*
// ==/UserScript==

//v1.1 - don't add zero
//v1.2 - use mutationobserver instead

var target = document.getElementById("badge_notices");
if(window.top == window.self && target != null)
{
	var title = document.title;
	if(target.innerHTML != "0")
		document.title = target.innerHTML + ": " + title;
	
	var observer = new MutationObserver(function(mutations) {
		if(target.innerHTML != "0")
			document.title = target.innerHTML + ": " + title;
		else
			document.title = title;
	});
	var config = { attributes: false, childList: true, characterData: false };
	observer.observe(target, config);
}
