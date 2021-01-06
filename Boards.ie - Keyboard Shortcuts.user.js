// ==UserScript==
// @name Boards.ie - Keyboard Shortcuts
// @namespace https://github.com/28064212/userscripts
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @version 1.9.8
// @downloadURL https://github.com/28064212/userscripts/raw/master/Boards.ie%20-%20Keyboard%20Shortcuts.user.js
// @description Left/right arrow keys for navigation in threads and forums, ctrl+left for parent forum, quickly switch focus to the "Find a Forum" or Search textboxes. Use z/a to navigate thread lists, and enter to open threads
// @include /^https?://(www\.)?boards\.ie/.*/
// ==/UserScript==

//from: https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = document.createElement('style');
	style.type = 'text/css';
	//style.innerHTML = css.replace(/;/g, ' !important;');
	style.innerHTML = css
	head.appendChild(style);
}

if (window.top == window.self) {
	addGlobalStyle("\
		.highlight436255 {\n\
			border:red solid 1px !important;\n\
			position:relative !important;\n\
			background-clip:padding-box !important;\n\
		}\n\
		#tooltip436255 {\n\
			display:none;\n\
		}\n\
		#tooltip436255 div {\n\
			background:#333;\n\
			background:rgba(0,0,0,.9);\n\
			border-radius:5px;\n\
			color:#fff;\n\
			padding:5px 15px;\n\
			position:absolute;\n\
			left:40%;\n\
			top:100%;\n\
			z-index:198;\n\
			width:60%;\n\
		}\n\
		.usermenu436255 {\n\
			color:#ffffff;\n\
			background-color:#3d3d3d;\n\
		}\n\
		.usermenu436255 a {\n\
			color:#ffffff;\n\
		}\n\
		#wrapper {\n\
			overflow:visible !important;\n\
		}");

	window.addEventListener('keydown', keyShortcuts, true);

	var loc = document.location.href;
	var ttforum = (loc.indexOf("/ttforum/") != -1);
	var ttfthread = (loc.indexOf("/ttfthread/") != -1);
	var forum = (loc.indexOf("forumdisplay.php") != -1);
	var thread = (loc.indexOf("showthread.php") != -1);
	var usercp = loc.indexOf("usercp.php") != -1;
	var search = loc.indexOf("/search/submit/") != -1;
	let re = /^https?:\/\/(www\.)?boards\.ie(\/(\?.*)?)?$/;
	var homepage = (re.test(loc));
	var index = -1;
	var tdindex = 1;
	if (forum) {
		if (document.getElementById('threadslist').getElementsByTagName("tr")[1].getElementsByTagName("td").length == 6)
			tdindex = 2;
	}
	var tooltip = document.createElement('div');
	tooltip.id = 'tooltip436255';
	var tooltipinner = document.createElement('div');
	tooltip.appendChild(tooltipinner);
	var showtooltips = false;
	var usermenu = null;
	var userindex = 1;
	if (ttforum) {
		window.addEventListener('load', function () {
			document.getElementById('submit').focus();
		}, true);
	}
}
/*
→ - 39
← - 37
Space - 32
m - 77
a - 65
z - 90
x - 88
s - 83
Enter - 13
o - 79
q - 81
t - 84
r - 82
f - 70
l - 76
p - 80
c - 67

\ - 220
↑ - 38
↓ - 40
Del - 46
` - 223
 */
function keyShortcuts(key) {
	var code = key.keyCode;
	var ctrl = key.ctrlKey;
	var alt = key.altKey;
	var intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT');
	var hl = document.getElementsByClassName('highlight436255')[0];
	if (code == 32 && ctrl) {
		// Ctrl + Space - searchbox
		if (document.getElementById("user_search_input") != null)
			document.getElementById("user_search_input").focus();
		else if (alt)
			document.getElementById("sbutton").focus();
		else
			document.getElementById("forumtitle").focus();
	}
	else if (code == 39 && !intext) {
		// => - increase page, or go to last page with ctrl
		if (ttforum || ttfthread || search) {
			if (ctrl && document.getElementsByClassName("last")[0] != null)
				location.href = document.getElementsByClassName("last")[0];
			else if (document.getElementsByClassName("next")[0] != null)
				location.href = document.getElementsByClassName("next")[0];
		}
		else if (homepage) {
			let next = document.querySelector(".arrow-next:not(.arrow-disable)");
			if (next != null)
				next.click();
		}
		else {
			var navlinks = document.getElementsByClassName("pagenav")[0].getElementsByTagName("a");
			for (var i = 0; i < navlinks.length; i++) {
				if (navlinks[i].rel == "next")
					location.href = navlinks[i];
			}
		}
	}
	else if (code == 37 && !intext) {
		// <= - decrease page, or go to parent forum with ctrl
		if (ttforum || ttfthread || search) {
			if (ctrl && !search) {
				var navbarlinks = document.getElementById("breadcrumb-inner").getElementsByTagName("a");
				location.href = navbarlinks[navbarlinks.length - 1];
			}
			else if (ctrl && search)
				location.href = document.getElementsByClassName("search_pagination")[0].getElementsByTagName('a')[0];
			else if (document.getElementsByClassName("prev")[0] != null)
				location.href = document.getElementsByClassName("prev")[0];
		}
		else if (homepage) {
			let prev = document.querySelector(".arrow-prev:not(.arrow-disable)");
			if (prev != null)
				prev.click();
		}
		else {
			if (ctrl) {
				var navbarlinks = document.getElementsByClassName("navbar")[0].parentNode.getElementsByTagName("a");
				location.href = navbarlinks[navbarlinks.length - 1];
			}
			else {
				var navlinks = document.getElementsByClassName("pagenav")[0].getElementsByTagName("a");
				for (var i = 0; i < navlinks.length; i++) {
					if (navlinks[i].rel == "prev")
						location.href = navlinks[i];
				}
			}
		}
	}
	else if (code == 77 && !intext && !ctrl && (forum || ttforum)) {
		// m - Mark forum read
		if (ttforum) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			document.getElementById("mark-forum-read").dispatchEvent(evt);
		}
		else {
			var toolsmenulinks = document.forms['forumadminform'].getElementsByTagName("a");
			for (var i = 0; i < toolsmenulinks.length; i++) {
				if (toolsmenulinks[i].innerHTML == "Mark This Forum Read") {
					var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
					toolsmenulinks[i].dispatchEvent(evt);
				}
			}
		}
	}
	else if ((usercp || forum || ttforum || homepage || thread || ttfthread || search) && !intext && (code == 65 || code == 90)) {
		// a/z - navigate forums/threads
		var list;
		if (forum)
			list = document.getElementById('threadslist').getElementsByTagName("tr");
		else if (ttforum)
			list = document.getElementsByClassName('forum-threadlist-table')[0].getElementsByTagName("tr");
		else if (usercp)
			list = document.getElementById('collapseobj_usercp_forums').getElementsByTagName("tr");
		else if (homepage)
			list = document.getElementsByClassName('module-wrapper')[0].getElementsByTagName("tr");
		else if (thread)
			list = document.getElementsByClassName('postcontent');
		else if (ttfthread)
			list = document.getElementsByClassName('postbit-wrapper');
		else if (search)
			list = document.getElementsByClassName('result_wrapper');
		if (hl != null)
			hl.classList.remove('highlight436255');
		if (hl != null && !isElementInViewport(hl))
			index = -1;
		if (index == -1) {
			if (code == 65) {
				if (ctrl) {
					index = (thread || ttfthread || search) ? 0 : 1;
					key.preventDefault();
				}
				else {
					for (var j = list.length - 1; j > ((thread || ttfthread || search) ? 0 : 1) && index == -1; j--) {
						if (isElementInViewport(list[j]))
							index = j;
					}
					if (index == -1)
						index = list.length - 1;
				}
			}
			else if (code == 90) {
				if (ctrl) {
					index = list.length - 1;
					key.preventDefault();
				}
				else {
					for (var j = ((thread || ttfthread || search) ? 0 : 1); j < list.length && index == -1; j++) {
						if (isElementInViewport(list[j]))
							index = j;
					}
					if (index == -1)
						index = (thread || ttfthread || search) ? 0 : 1;
				}
			}
		}
		else if (code == 65 && index > ((thread || ttfthread || search) ? 0 : 1)) {
			if (ctrl) {
				index = ((thread || ttfthread || search) ? 0 : 1);
				key.preventDefault();
			}
			else
				index--;
		}
		else if (code == 90 && index < list.length - 1) {
			if (ctrl) {
				index = list.length - 1;
				key.preventDefault();
			}
			else
				index++;
		}
		if (thread)
			list[index].parentNode.parentNode.parentNode.parentNode.classList.add('highlight436255');
		else if (ttfthread || search)
			list[index].classList.add('highlight436255');
		else
			list[index].getElementsByTagName("td")[tdindex].classList.add('highlight436255');
		if (usermenu != null && (thread || ttfthread)) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			if (thread) {
				hl.getElementsByClassName('bigusername')[0].parentNode.dispatchEvent(evt);
			}
			else if (ttfthread) {
				hl.getElementsByClassName('userinfo-username')[0].dispatchEvent(evt);
			}
			usermenu.getElementsByClassName('usermenu436255')[0].classList.remove('usermenu436255');
			usermenu = null;
		}
		hl = document.getElementsByClassName('highlight436255')[0];
		if (!isElementInViewport(hl))
			hl.scrollIntoView(code == 90);
		if (homepage || forum || ttforum) {
			tooltipinner.innerHTML = ttforum ? hl.getElementsByTagName('a')[0].title.replace(/(\r\n|\n|\r)/gm, '<br />') : hl.title.replace(/(\r\n|\n|\r)/gm, '<br />');
			hl.appendChild(tooltip);
		}
	}
	else if ((ttforum || forum) && !intext && code == 81 && hl != null) {
		// q - open highlighted thread in forum view
		if (ctrl) {
			// first post
			var threadlinks = hl.getElementsByTagName("a");
			for (var j = 0; j < threadlinks.length; j++) {
				if (threadlinks[j].id.lastIndexOf("thread_title_") === 0)
					window.open(threadlinks[j]);
			}
		}
		else if (alt) {
			// last page
			if (ttforum)
				window.open(hl.getElementsByClassName('threadbit-threadlink-pages')[0].getElementsByTagName('a')[hl.getElementsByClassName('threadbit-threadlink-pages')[0].getElementsByTagName('a').length - 1]);
			else
				window.open(hl.getElementsByTagName("div")[0].getElementsByTagName("a")[hl.getElementsByTagName("div")[0].getElementsByTagName("a").length - 1]);
		}
		else {
			// last unread post
			if (ttforum) {
				if (hl.getElementsByClassName('spritethreadbit-firstunread')[0] != null)
					window.open(hl.getElementsByClassName('spritethreadbit-firstunread')[0].parentNode);
				else
					window.open(hl.parentNode.getElementsByTagName("td")[tdindex + 1].getElementsByTagName("a")[hl.parentNode.getElementsByTagName("td")[tdindex + 1].getElementsByTagName("a").length - 2]);
			}
			else {
				var threadlinks = hl.getElementsByTagName("a");
				for (var j = 0; j < threadlinks.length; j++) {
					if (threadlinks[j].id.lastIndexOf("thread_gotonew_") === 0)
						window.open(threadlinks[j]);
				}
			}
		}
	}
	else if ((usercp || search) && !intext && code == 81 && hl != null) {
		// q - open highlighted forum in usercp or thread in search results
		window.open(hl.getElementsByTagName("a")[0]);
	}
	else if ((thread || ttfthread) && !intext && code == 81 && usermenu != null) {
		// q - open from usermenu
		window.open(usermenu.getElementsByClassName('usermenu436255')[0].getElementsByTagName('a')[0]);
	}
	else if (homepage && !intext && code == 81 && hl != null) {
		// q - open highlighted thread on homepage
		if (ctrl)
			// first post
			window.open(hl.getElementsByTagName("a")[0]);
		else if (alt)
			// last post
			window.open(hl.parentNode.getElementsByTagName('td')[tdindex + 1].getElementsByTagName("a")[0]);
		else
			// first unread post
			window.open(hl.getElementsByTagName("a")[1]);
	}
	else if ((forum || ttforum) && !intext && !ctrl && code == 79) {
		// O - open all unread threads
		if (ttforum) {
			var linksj = document.getElementsByClassName("spritethreadbit-firstunread");
			for (var j = 0; j < linksj.length; j++)
				window.open(linksj[j].parentNode.href);
		}
		else {
			var linksj = document.getElementsByTagName("a");
			for (var j = 0; j < linksj.length; j++) {
				if (linksj[j].id.indexOf("gotonew") != -1)
					window.open(linksj[j].href);
			}
		}
	}
	else if (usercp && !intext && !ctrl && code == 79) {
		// O - open all unread
		var linksj = document.getElementById('collapseobj_usercp_subthreads').getElementsByTagName('tr');
		for (var j = 1; j < linksj.length - 1; j++) {
			var x = 1;
			if (linksj[j].getElementsByTagName("td").length == 6)
				x = 2;
			if (linksj[j].getElementsByTagName('td')[x].getElementsByTagName('a')[0].id.lastIndexOf('thread_gotonew', 0) === 0)
				window.open(linksj[j].getElementsByTagName('td')[x].getElementsByTagName('a')[0]);
			else if (linksj[j].getElementsByTagName('td')[x].getElementsByTagName('a')[1].id.lastIndexOf('thread_gotonew', 0) === 0)
				window.open(linksj[j].getElementsByTagName('td')[x].getElementsByTagName('a')[1]);
		}
	}
	else if (!intext && !ctrl && code == 81 && hl != null) {
		// q - quote highlighted
		if (ttfthread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			hl.getElementsByClassName('reply')[0].dispatchEvent(evt);
		}
		else if (thread)
			location.href = hl.getElementsByClassName('postbit_quote')[0];
	}
	else if (!intext && !ctrl && code == 84 && hl != null) {
		// t - thank/unthank highlighted
		if (ttfthread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			if (hl.getElementsByClassName('thank')[0] != null)
				hl.getElementsByClassName('thank')[0].dispatchEvent(evt);
			else if (hl.getElementsByClassName('remove-thank')[0])
				hl.getElementsByClassName('remove-thank')[0].dispatchEvent(evt);
		}
		else if (thread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			if (hl.getElementsByClassName('postbit_thanks')[0] != null)
				hl.getElementsByClassName('postbit_thanks')[0].dispatchEvent(evt);
			//else if(hl.getElementsByClassName('remove-thank')[0])
			//	hl.getElementsByClassName('remove-thank')[0].dispatchEvent(evt);
		}
	}
	else if (!intext && !ctrl && code == 77 && hl != null) {
		// m - multi-quote highlighted
		if (ttfthread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			if (hl.getElementsByClassName('multiquote')[0] != null)
				hl.getElementsByClassName('multiquote')[0].dispatchEvent(evt);
		}
		else if (thread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			if (hl.getElementsByClassName('postbit_multiquote_off')[0] != null)
				hl.getElementsByClassName('postbit_multiquote_off')[0].dispatchEvent(evt);
			else if (hl.getElementsByClassName('postbit_multiquote_on')[0])
				hl.getElementsByClassName('postbit_multiquote_on')[0].dispatchEvent(evt);
		}
	}
	else if (!intext && !ctrl && code == 82) {
		// r - reply to thread/post new thread
		if (thread)
			location.href = document.getElementsByClassName('vB_Navigation_PostReplyTop')[0];
		else if (ttfthread) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			document.getElementsByClassName('post-reply-button')[0].dispatchEvent(evt);
		}
		else if (ttforum) {
			var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
			document.getElementsByClassName('post-question-button')[0].dispatchEvent(evt);
		}
	}
	else if (!intext && !ctrl && code == 70) {
		// f - follow/unfollow
		if (forum || ttforum) {
			if (document.getElementsByClassName('unfollow_forum')[0].style.display != 'none') {
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				document.getElementsByClassName('unfollow_forum')[0].dispatchEvent(evt);
			}
			else {
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				if (document.getElementById("follow_form"))
					document.getElementById("follow_form").getElementsByTagName("span")[0].dispatchEvent(evt);
				else
					document.getElementsByClassName('follow_forum')[0].dispatchEvent(evt);
			}
		}
		else if (thread || ttfthread) {
			if (document.getElementsByClassName('unfollow_thread')[0].style.display != 'none') {
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				document.getElementsByClassName('unfollow_thread')[0].dispatchEvent(evt);
			}
			else {
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				if (document.getElementById("follow_form"))
					document.getElementById("follow_form").getElementsByTagName("span")[0].dispatchEvent(evt);
				else
					document.getElementsByClassName('follow_thread')[0].dispatchEvent(evt);
			}
		}
	}
	else if (!intext && !ctrl && hl != null && code >= 48 && code <= 57) {
		// 0-9: open links
		code = code == 48 ? 10 : code - 49;
		if (thread && hl.getElementsByClassName('postcontent')[0].parentNode.getElementsByTagName('a')[code] != null)
			window.open(hl.getElementsByClassName('postcontent')[0].parentNode.getElementsByTagName('a')[code]);
		else if (ttfthread && hl.getElementsByClassName('postbit-postbody')[0].getElementsByTagName('a')[code] != null)
			window.open(hl.getElementsByClassName('postbit-postbody')[0].getElementsByTagName('a')[code]);
	}
	else if (!intext && (forum || ttforum || homepage) && !ctrl && code == 88 && hl != null) {
		// x - toggle tooltips display
		showtooltips = !showtooltips;
		tooltip.style.display = showtooltips ? 'block' : 'none';
	}
	else if (!intext && !ctrl && code == 80 && hl != null && (thread || ttfthread) && hl.getElementsByClassName('customspamlink')[0] != null) {
		// p - Report spammer (if https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Quick%20Spam%20Reporting.user.js also installed)
		window.open(hl.getElementsByClassName('customspamlink')[0]);
	}
	else if (!intext && !ctrl && (code == 83 || code == 88)) {
		// x/s - use to navigate a user's profile menu in thread view if highlighted
		if (thread) {
			if (usermenu == null && hl != null) {
				usermenu = hl.parentNode.getElementsByClassName('vbmenu_popup')[0];
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				hl.getElementsByClassName('bigusername')[0].parentNode.dispatchEvent(evt);
				userindex = 1;
				usermenu.getElementsByTagName('td')[userindex].classList.add('usermenu436255');
			}
			else {
				if (code == 83 && userindex > 1) {
					usermenu.getElementsByTagName('td')[userindex].classList.remove('usermenu436255');
					userindex--;
					usermenu.getElementsByTagName('td')[userindex].classList.add('usermenu436255');
				}
				else if (code == 88 && userindex < usermenu.getElementsByTagName('td').length - 1) {
					usermenu.getElementsByTagName('td')[userindex].classList.remove('usermenu436255');
					userindex++;
					usermenu.getElementsByTagName('td')[userindex].classList.add('usermenu436255');
				}
			}
		}
		else if (ttfthread) {
			if (usermenu == null && hl != null) {
				usermenu = hl.getElementsByClassName('user-tools')[0];
				var evt = new MouseEvent("click", { bubbles: true, cancelable: true });
				hl.getElementsByClassName('userinfo-username')[0].dispatchEvent(evt);
				userindex = 0;
				usermenu.getElementsByTagName('li')[userindex].classList.add('usermenu436255');
			}
			else {
				if (code == 83 && userindex > 0) {
					usermenu.getElementsByTagName('li')[userindex].classList.remove('usermenu436255');
					userindex--;
					usermenu.getElementsByTagName('li')[userindex].classList.add('usermenu436255');
				}
				else if (code == 88 && userindex < usermenu.getElementsByTagName('li').length - 1) {
					usermenu.getElementsByTagName('li')[userindex].classList.remove('usermenu436255');
					userindex++;
					usermenu.getElementsByTagName('li')[userindex].classList.add('usermenu436255');
				}
			}
		}
	}
	else if (thread && alt && code == 67) {
		if (document.querySelectorAll('[alt="Unread"]') != null)
			document.querySelectorAll('[alt="Unread"]')[0].scrollIntoView();
	}
}
function isElementInViewport(el) {
	var rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
