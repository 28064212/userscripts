// ==UserScript==
// @name Boards.ie - Reformat Homepage
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Makes logo smaller, cuts down on whitespace
// @version 1.3.1
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Reformat%20Homepage.user.js
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @include http://www.boards.ie/
// @include http://www.boards.ie/?
// @include https://www.boards.ie/
// @include https://www.boards.ie/?
// @include http://www.boards.ie/?filter=*
// @include https://www.boards.ie/?filter=*
// ==/UserScript==

// v1.2 - Updated for new Beta skin
// v1.3 - Removed superfluous space at the bottom,top of the page

if(document.getElementById("user_search_input") != null)
{
	document.getElementsByClassName("home_ads")[0].style.display = "none";
	GM_addStyle("td.alt2{padding:2px;}td.alt1{padding:2px}");
	document.getElementsByClassName("wrapper")[0].style.paddingBottom = "0";
	document.getElementsByClassName("holder")[1].style.paddingBottom = "0";
	document.getElementById("footer").style.minHeight = "0";
	document.getElementById("footer").style.marginTop = "0";
	document.getElementById("footer").style.height = "auto";
	document.getElementsByClassName("home-container")[0].style.marginTop = "0";
	document.getElementsByClassName("tabs-bottom")[0].style.display = "none";
}
else
{
	document.getElementById("topbar").getElementsByTagName("td")[0].firstChild.style.height = "66px";
	document.getElementsByClassName("footer")[0].style.display = "none";
	document.getElementById("topbar").getElementsByTagName("td")[2].height = "10px";
	document.getElementById("topbar").getElementsByTagName("td")[2].getElementsByTagName("tr")[1].style.display = "none";
	document.getElementsByClassName("page")[0].getElementsByTagName("td")[0].style.padding = "0";
	document.getElementsByClassName("page")[1].cellSpacing = "0";
}
