// ==UserScript==
// @name Boards.ie - Open Unread Threads
// @namespace https://github.com/28064212/greasemonkey-scripts
// @include http://www.boards.ie/vbulletin/forumdisplay.php*
// @include https://www.boards.ie/vbulletin/forumdisplay.php*
// @include http://www.boards.ie/ttforum/*
// @include https://www.boards.ie/ttforum/*
// @version 1.1
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Open%20Unread%20Threads.user.js
// @icon http://s3.amazonaws.com/uso_ss/icon/125952/large.png
// @description Open all unread threads on a forum page at the last post
// ==/UserScript==

// v1.1 - updated to work with Talk to Forums
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
	console.log("a"); return; }
	console.log("b");
    style = document.createElement('style');
    style.type = 'text/css';
    //style.innerHTML = css.replace(/;/g, ' !important;');
	style.innerHTML = css
    head.appendChild(style);
}

addGlobalStyle(".openunreadbtn{" +
		"width:120px;" +
		"height:31px;" +
		"background:#F3F3F3;" +
		"background:-webkit-gradient(linear, left top, left bottom, from(#ffffff), to(#E4E4E4));" +
		"background:-moz-linear-gradient(top,  #ffffff,  #E4E4E4);" +
		"border:#cccccc 1px solid;" +
		"position:relative;" +
		"text-align:center;" +
		"line-height:31px;" +
		"color:#444444;" +
		"font-family:Verdana;" +
		"margin-left:10px;" +
		"font-size:13px;" +
		"font-weight:bold;" +
		"cursor:pointer;" +
	"}" +
	".openunreadbtn:hover{" +
		"background:#F3F3F3;" +
		"background:-webkit-gradient(linear, left top, left bottom, from(#E4E4E4), to(#ffffff));" +
		"background:-moz-linear-gradient(top,  #E4E4E4,  #ffffff);" +
	"}" +
	".openunreadpage *{" +
		"display:block;" +
		"padding:0;" +
		"margin:0;" +
	"}");
if(document.location.href.indexOf("ttforum") != -1)
{
	var tabs = document.getElementsByClassName("topbox-tabs")[0];
	var li = document.createElement("li");
	li.className = "tab-search";
	li.style.cursor = "pointer";
	var a = document.createElement("a");
	a.innerHTML = "Open Unread";
	
	li.addEventListener("click", function(){
			var linksj = document.getElementsByClassName("spritethreadbit-firstunread");
			for(var j = 0; j < linksj.length; j++)
				window.open(linksj[j].parentNode.href);
		}, true);
	
	li.appendChild(a);
	tabs.appendChild(li);
}
else
{
	var links = document.getElementsByTagName("a");
	for(var i = 0; i < links.length; i++)
	{
		if(links[i].href.indexOf("newthread.php") != -1 && links[i].parentNode.className != "vbmenu_option")
		{ 
			var td = document.createElement("td");
			td.style.width = "0px";
			var openunread = document.createElement("div");
			openunread.className = "openunreadbtn";
			openunread.innerHTML = "Open Unread";
			openunread.addEventListener("click", function(){
						var linksj = document.getElementsByTagName("a");
						for(var j = 0; j < linksj.length; j++)
						{
							if(linksj[j].id.indexOf("gotonew") != -1)
								window.open(linksj[j].href);
						}
					}, true);
			td.appendChild(openunread);
			links[i].parentNode.style.width = "0px";
			links[i].parentNode.parentNode.insertBefore(td, links[i].parentNode.nextSibling);
		}
	}
}
