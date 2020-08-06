// ==UserScript==
// @name Boards.ie - Total Ignore
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Hides ignored users' posts totally, as well as text from posts that quote them (leaves option to display those posts)
// @version 1.3.1
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Total%20Ignore.user.js
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @include http://www.boards.ie/vbulletin/showthread.php*
// @include https://www.boards.ie/vbulletin/showthread.php*
// @grant GM_xmlhttpRequest
// ==/UserScript==

if (window.top !== window.self)
	return;

var SCORCHED_EARTH = false; // if true, totally remove posts that quote someone on ignore. Otherwise, they're just hidden, with an option to "show post"

var links = document.getElementsByTagName("a");
for (var i = 0; i < links.length; i++) {
	if (links[i].innerHTML == "Remove user from ignore list")
		links[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
}

GM_xmlhttpRequest({
	method: "GET",
	url: "https://www.boards.ie/vbulletin/profile.php?do=ignorelist",
	onload: function (response) {
		//from https://developer.mozilla.org/en-US/docs/Code_snippets/HTML_to_DOM
		var parsedhtml = document.implementation.createHTMLDocument("example");
		parsedhtml.documentElement.innerHTML = response.responseText;
		if (parsedhtml.getElementById("ignorelist") != null) {
			var ignoreduserslinks = parsedhtml.getElementById("ignorelist").getElementsByTagName("a");
			var ignoredusers = new Array();
			for (var i = 0; i < ignoreduserslinks.length; i++)
				ignoredusers.push(ignoreduserslinks[i].innerHTML);
			var quotes = document.getElementsByClassName("alt2");
			for (var i = 0; i < quotes.length; i++) {
				if (quotes[i].style.border.indexOf("inset") != -1 && quotes[i].getElementsByTagName("strong")[0] != null
					&& ignoredusers.indexOf(quotes[i].getElementsByTagName("strong")[0].innerHTML) != -1) {
					if (SCORCHED_EARTH) {
						quotes[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
					}
					else {
						var post = quotes[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
						var extradiv = document.createElement("div");
						extradiv.innerHTML = post.innerHTML;
						extradiv.style.visibility = "hidden";
						post.innerHTML = "";
						var show = document.createElement("div");
						show.innerHTML = "---This post quotes ignored user, click to show---";
						show.style.textDecoration = "underline";
						show.style.cursor = "pointer";
						show.onclick = function () {
							this.nextSibling.style.visibility = "visible";
							this.style.display = "none";
						};
						post.appendChild(show);
						post.appendChild(extradiv);
					}
				}
			}
		}
	}
});
