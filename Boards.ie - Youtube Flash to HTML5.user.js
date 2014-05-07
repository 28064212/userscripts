// ==UserScript==
// @name Boards.ie - Youtube Flash to HTML5
// @namespace https://github.com/28064212/greasemonkey-scripts
// @description Use HTML5 embed code instead of Flash
// @version 1.0
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Youtube%20Flash%20to%20HTML5.user.js
// @icon http://s3.amazonaws.com/uso_ss/icon/125952/large.png
// @include http://www.boards.ie/vbulletin/showthread.php*
// ==/UserScript==

var embeds = document.getElementsByTagName("embed");
for(var i = 0; i < embeds.length; i++)
{
	if(embeds[i].src.indexOf("youtube") > 0)
	{
		embeds[i].parentNode.style.display = "none";
		var vid = document.createElement("iframe");
		vid.width = embeds[i].width;
		vid.height = embeds[i].height;
		vid.className = "youtube-player";
		vid.type = "text/html";
		vid.frameBorder = "0";
		vid.setAttribute('allowFullScreen', '')
		vid.src = "http://www.youtube.com/embed/" + embeds[i].src.substring().replace("http://www.youtube.com/v/", "").replace("?version=3&amp;hl=en_US");
		embeds[i].parentNode.parentNode.insertBefore(vid, embeds[i].parentNode);
		
		/*var button = document.createElement("button");
		button.value = "Convert";
		button.innerHTML = "Convert";
		button.onclick = function(){
			alert(vid.src);
		}
		embeds[i].parentNode.parentNode.appendChild(button);*/
	}
}
