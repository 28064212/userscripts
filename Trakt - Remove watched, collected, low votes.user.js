// ==UserScript==
// @name        Trakt - Remove watched, collected, low votes
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Trakt%20-%20Remove%20watched,%20collected,%20low%20votes.user.js
// @description Remove watched, collected, low votes
// @include     http://trakt.tv/*
// @version     1.2
// @grant	GM_addStyle
// ==/UserScript==

//v1.1 Trakt v2 - use ctrl+Z to bring up buttons
//v1.2 Just remove on ctrl+Z, don't use buttons

/*GM_addStyle("\
	.gmbutton {\
		position: fixed !important;\
		right: 10px;\
		width: 100px;\
		\
		-moz-box-shadow: 0px 10px 14px -7px #3e7327;\
		-webkit-box-shadow: 0px 10px 14px -7px #3e7327;\
		box-shadow: 0px 10px 14px -7px #3e7327;\
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #77b55a), color-stop(1, #72b352));\
		background:-moz-linear-gradient(top, #77b55a 5%, #72b352 100%);\
		background:-webkit-linear-gradient(top, #77b55a 5%, #72b352 100%);\
		background:-o-linear-gradient(top, #77b55a 5%, #72b352 100%);\
		background:-ms-linear-gradient(top, #77b55a 5%, #72b352 100%);\
		background:linear-gradient(to bottom, #77b55a 5%, #72b352 100%);\
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#77b55a', endColorstr='#72b352',GradientType=0);\
		background-color:#77b55a;\
		-moz-border-radius:4px;\
		-webkit-border-radius:4px;\
		border-radius:4px;\
		border:1px solid #4b8f29;\
		display:inline-block;\
		cursor:pointer;\
		color:#ffffff;\
		font-family:arial;\
		font-size:13px;\
		font-weight:bold;\
		padding:6px 12px;\
		text-decoration:none;\
		text-shadow:0px 1px 0px #5b8a3c;\
	}\
");*/
/*
(function (old) {
	window.history.pushState = function () {
		old.apply(window.history, arguments);
		alert(window.location.href);
	}
})(window.history.pushState);
*/
if(window.top == window.self)
{
	window.addEventListener('keydown', function(key) {
		var code = key.keyCode;
		var ctrl = key.ctrlKey;
		var alt = key.altKey;
		if(code == 90 && ctrl)
		{
			/*var b1 = document.createElement("button");
			b1.className = "gmbutton";
			b1.style.top = "30px";
			b1.innerHTML = "Watchlist";
			b1.addEventListener('click', function() {*/
				var x = document.getElementsByClassName("list selected");
				for(var i = 0; i < x.length; i++)
					x[i].parentNode.parentNode.parentNode.style.display = 'none';
			/*});
			document.body.appendChild(b1);
			var b2 = document.createElement("button");
			b2.className = "gmbutton";
			b2.style.top = "65px";
			b2.innerHTML = "Collection";
			b2.addEventListener('click', function() {*/
				var x = document.getElementsByClassName("collect selected");
				for(var i = 0; i < x.length; i++)
					x[i].parentNode.parentNode.parentNode.style.display = 'none';
			/*});
			document.body.appendChild(b2);
			var b3 = document.createElement("button");
			b3.className = "gmbutton";
			b3.style.top = "100px";
			b3.innerHTML = "Low Votes";
			b3.addEventListener('click', function() {
				var x = document.getElementsByClassName("votes");
				for(var i =0; i < x.length; i++)
				{
					if(x[i].innerHTML.replace(" votes", "") < 10)
						x[i].parentNode.parentNode.style.display = 'none';
				}
			});
			document.body.appendChild(b3);*/
		}
	}, true);
}
