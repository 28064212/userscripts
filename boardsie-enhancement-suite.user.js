// ==UserScript==
// @name Boardsie Enhancement Suite
// @namespace https://github.com/28064212/userscripts
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @downloadURL https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.js
// @resource css https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.css
// @grant GM_getResourceText
// @grant GM_addStyle
// @include /^https?://(www\.)?boards\.ie/.*/
// @description Left/right arrow keys for navigation in threads and forums, ctrl+left for parent, . Use z/a to navigate thread lists, and enter to open threads
// @version 1.0
// ==/UserScript==

let index = -1;
let showpreviews = false;
if (window.top == window.self) {
	let css = GM_getResourceText("css");
	GM_addStyle(css);
	window.addEventListener('keydown', keyShortcuts, true);
	unboldRead();
	removeExternalLinkCheck();
	addThanks();
	addPreviews();
}
function unboldRead() {
	for (let t of document.querySelectorAll('.forum-threadlist-thread')) {
		if (t.querySelector('.HasNew') == null && t.querySelector('.unread') != null)
			t.querySelector('.unread').classList.remove('unread');
	}
}
function removeExternalLinkCheck() {
	for (let a of document.querySelectorAll('a[href]')) {
		let url = new URL(a.href);
		if (url.pathname.indexOf("/home/leaving") == 0 && url.hostname.indexOf('boards.ie') != -1) {
			let needle = "/home/leaving?allowTrusted=1&target=";
			a.href = decodeURIComponent(a.href.substring(a.href.indexOf(needle) + needle.length))
		}
	}
}
function addPreviews() {
	let discussions = document.querySelectorAll('a.threadbit-threadlink');
	for (let d of discussions) {
		let loc = new URL(d.href).pathname.replace('/discussion/', '');
		let id = loc.slice(0, loc.indexOf('/'));
		fetch('/api/v2/discussions/' + id + '/')
			.then(response => {
				if (response.ok)
					return response.json();
				else
					throw new Error(response.statusText);
			})
			.then(data => {
				if (data.body) {
					let div = document.createElement("div");
					d.parentElement.appendChild(div);
					div.classList.add("preview-28064212");
					div.innerHTML = data.body;
					div.style.display = "none";
					d.addEventListener('mouseover', function (e) {
						e.target.parentElement.querySelector(".preview-28064212").style.display = "block";
					});
					d.addEventListener('mouseout', function (e) {
						e.target.parentElement.querySelector(".preview-28064212").style.display = "none";
					});
				}
			})
			.catch(error => { });
	}
}
function addThanks() {
	let starter = document.querySelector('.ItemDiscussion');
	if (starter && starter.querySelector('.HasCount')) {
		let loc = window.location.pathname.replace('/discussion/', '');
		let starterid = loc.slice(0, loc.indexOf('/'));
		fetch('/api/v2/discussions/' + starterid + '/reactions?limit=100&type=Like')
			.then(response => {
				if (response.ok)
					return response.json();
				else
					throw new Error(response.statusText);
			})
			.then(data => {
				let thankscontainer = document.createElement('div');
				thankscontainer.classList.add('thanks-28064212')
				let thanksdiv = document.createElement('div');
				let thankersdiv = document.createElement('div');
				let thankers = [];
				for (let d of data) {
					thankers.push(d.user.name);
				}
				thankersdiv.innerText = thankers.sort(function (a, b) {
					return a.toLowerCase().localeCompare(b.toLowerCase());
				}).join(', ');
				thanksdiv.innerText = "Thanks (" + thankers.length + ")";
				thankscontainer.appendChild(thanksdiv);
				thankscontainer.appendChild(thankersdiv);
				starter.appendChild(thankscontainer);
			})
			.catch(error => { });
	}
	for (let comment of document.querySelectorAll('.ItemComment ')) {
		if (comment.querySelector('.HasCount')) {
			let id = comment.id.replace('Comment_', '');
			fetch('/api/v2/comments/' + id + '/reactions?limit=100&type=Like')
				.then(response => {
					if (response.ok)
						return response.json();
					else
						throw new Error(response.statusText);
				})
				.then(data => {
					let thankscontainer = document.createElement('div');
					thankscontainer.classList.add('thanks-28064212')
					let thanksdiv = document.createElement('div');
					let thankersdiv = document.createElement('div');
					let thankers = [];
					for (let d of data) {
						thankers.push(d.user.name);
					}
					thankersdiv.innerText = thankers.sort(function (a, b) {
						return a.toLowerCase().localeCompare(b.toLowerCase());
					}).join(', ');
					thanksdiv.innerText = "Thanks (" + thankers.length + ")";
					thankscontainer.appendChild(thanksdiv);
					thankscontainer.appendChild(thankersdiv);
					comment.appendChild(thankscontainer);
				})
				.catch(error => { });
		}
	}
}
function isElementInViewport(el) {
	let rect = el.getBoundingClientRect();
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
function keyShortcuts(key) {
	let code = key.keyCode;
	let ctrl = key.ctrlKey;
	let alt = key.altKey;
	let shift = key.shiftKey;
	let intext = (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT' || document.activeElement.contentEditable == "true");
	let hl = document.getElementsByClassName('highlight-28064212')[0];
	if (!intext) {
		if (ctrl && code == 32 && document.querySelector('button[title=Search]')) {
			// Ctrl + Space - searchbox
			document.querySelector('button[title=Search]').click()
		}
		else if (code == 39) {
			// → - next page, last page with shift
			if (shift && document.querySelector('.Pager a.LastPage'))
				location.href = document.querySelector('.Pager a.LastPage');
			else if (document.querySelector('.Pager a.Next') != null)
				location.href = document.querySelector('.Pager a.Next');
		}
		else if (code == 37) {
			// ← - previous page, first page with shift, parent forum with ctrl
			if (shift && document.querySelector('.Pager a.FirstPage'))
				location.href = document.querySelector('.Pager a.FirstPage');
			else if (ctrl) {
				let items = document.querySelectorAll('.Breadcrumbs a');
				if (items.length > 0) {
					if (location.href != items[items.length - 1].href)
						location.href = items[items.length - 1];
					else if (items.length > 1)
						location.href = items[items.length - 2];
				}
			}
			else if (document.querySelector('.Pager a.Previous'))
				location.href = document.querySelector('.Pager a.Previous');
		}
		else if (code == 65 || code == 90) {
			// a/z - navigate forums/threads
			let list = document.querySelectorAll('.forum-threadlist-table tbody tr, .module-wrapper tbody tr, .ItemComment, .ItemDiscussion');
			if (list.length > 0) {
				if (hl) {
					hl.classList.remove('highlight-28064212');
					if (hl.querySelector(".preview-28064212"))
						hl.querySelector(".preview-28064212").style.display = "none";
				}
				if (hl && !isElementInViewport(hl))
					index = -1;
				if (ctrl) {
					key.preventDefault();
					index = code == 65 ? 0 : list.length - 1;
				}
				if (index == -1) {
					if (code == 65) {
						for (let j = list.length - 1; j > 0 && index == -1; j--) {
							if (isElementInViewport(list[j]))
								index = j;
						}
						if (index == -1)
							index = list.length - 1;
					}
					else if (code == 90) {
						for (let j = 0; j < list.length && index == -1; j++) {
							if (isElementInViewport(list[j]))
								index = j;
						}
						if (index == -1)
							index = 0;
					}
				}
				else if (code == 65 && index > 0) {
					index--;
				}
				else if (code == 90 && index < list.length - 1) {
					index++;
				}
				hl = list[index];
				hl.classList.add('highlight-28064212');
				if (showpreviews && hl.querySelector(".preview-28064212"))
					hl.querySelector(".preview-28064212").style.display = "block";
				if (!isElementInViewport(hl))
					hl.scrollIntoView(code == 90);
			}
		}
		else if (code == 81 && hl) {
			// q - open thread/forum or quote highlighted post
			if (ctrl && hl.querySelector('.MiniPager') && hl.querySelector('.MiniPager').querySelector('a:first-of-type')) {
				// first page
				window.open(hl.querySelector('.MiniPager').querySelector('a:first-of-type'));
			}
			else if (alt && hl.querySelector('.MiniPager') && hl.querySelector('.MiniPager').querySelector('a:last-of-type')) {
				// last page
				window.open(hl.querySelector('.MiniPager').querySelector('a:last-of-type'));
			}
			else if (hl.querySelector('.oplink-wrapper a, a.threadbit-threadlink')) {
				// last unread post
				window.open(hl.querySelector('.oplink-wrapper a, a.threadbit-threadlink'));
			}
			else if (hl.querySelector('a.Quote')) {
				// quote highlighted post
				hl.querySelector('a.Quote').click();
				key.preventDefault();
			}
		}
		else if (!ctrl && code == 76 && document.querySelector('#latest')) {
			// l - scroll to latest
			document.querySelector('#latest').scrollIntoView();
		}
		else if (!ctrl && code == 79) {
			// o - open all unread threads
			let threads = document.querySelectorAll('.forum-threadlist-thread');
			for (let t of threads) {
				if (t.querySelector('.HasNew'))
					window.open(t.querySelector('a'));
			}
		}
		else if (!ctrl && code == 70) {
			// f - follow/unfollow
			if (document.querySelector('a.Bookmark'))
				document.querySelector('a.Bookmark').click();
			else if (document.querySelector('a.followButton'))
				document.querySelector('a.followButton').click();
		}
		else if (!ctrl && hl && code >= 48 && code <= 57) {
			// 0-9: open links
			code = code == 48 ? 10 : code - 49;
			if (hl.classList.contains('postbit-wrapper') && hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)').length > 0 && hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code])
				window.open(hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code]);
		}
		else if (!ctrl && code == 77) {
			// m - Mark forum read
			let title = document.querySelector('.HomepageTitle a');
			if (title) {
				let transientKey = title.href.substring(title.href.lastIndexOf('/') + 1, title.length);
				let category = document.querySelector('meta[name=catid]').content;
				fetch("/category/markread?categoryid=" + category + "&tkey=" + transientKey)
					.then(alert('Marked read, close dialog to refresh'))
					.then(location.reload());
			}
		}
		else if (!ctrl && code == 84 && hl && hl.querySelector('.ReactButton-Like')) {
			// t - toggle thanks of highlighted post
			hl.querySelector('.ReactButton-Like').click();
		}
		else if (!ctrl && code == 82) {
			// r - reply to thread/post new thread
			if (document.querySelector('.richEditor-text')) {
				key.preventDefault();
				document.querySelector('.richEditor-text').focus();
				document.querySelector('.richEditor-text').scrollIntoView();
			}
		}
		else if (!ctrl && code == 80 && hl && hl.getElementsByClassName('customspamlink').length > 0) {
			// p - Report spammer (if https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Quick%20Spam%20Reporting.user.js also installed)
			window.open(hl.getElementsByClassName('customspamlink')[0]);
		}
		else if (!ctrl && code == 88) {
			// x - toggle previews display
			showpreviews = !showpreviews;
			if (hl.querySelector(".preview-28064212"))
				hl.querySelector(".preview-28064212").style.display = showpreviews ? "block" : "none";
		}
		else if (shift && code == 191) {
			// ? - show/hide documentation
			let d = document.querySelector('#docs-28064212');
			if (d == null) {
				d = document.createElement('div');
				d.id = 'docs-28064212';
				d.style.display = 'none';
				document.body.appendChild(d);
				d.innerHTML = `
				<div id="docs-28064212">
				<div id="docs-content-28064212">
					<p>Boardsie Enhancement Suite</p>
					<div class="docs-keygroup">
						<p>General</p>
						<table>
							<tbody>
								<tr>
									<td><kbd>?</kbd></td>
									<td>Toggle documentation</td>
								</tr>
								<tr>
									<td><kbd>a / z</kbd></td>
									<td>Highlight next/previous</td>
								</tr>
								<tr>
									<td><kbd>→</kbd></td>
									<td>Next page</td>
								</tr>
								<tr>
									<td><kbd>shift</kbd><kbd>→</kbd></td>
									<td>Last page</td>
								</tr>
								<tr>
									<td><kbd>←</kbd></td>
									<td>Previous page</td>
								</tr>
								<tr>
									<td><kbd>shift</kbd><kbd>←</kbd></td>
									<td>First page</td>
								</tr>
								<tr>
									<td><kbd>ctrl</kbd><kbd>←</kbd></td>
									<td>Go to parent</td>
								</tr>
								<tr>
									<td><kbd>ctrl</kbd><kbd>space</kbd></td>
									<td>Focus on search box</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="docs-keygroup">
						<p>Thread Lists</p>
						<table>
							<tbody>
								<tr>
									<td><kbd>q</kbd></td>
									<td>Open highlighted thread</td>
								</tr>
								<tr>
									<td><kbd>ctrl</kbd><kbd>q</kbd></td>
									<td>Open at last page</td>
								</tr>
								<tr>
									<td><kbd>alt</kbd><kbd>q</kbd></td>
									<td>Open at first page</td>
								</tr>
								<tr>
									<td><kbd>r</kbd></td>
									<td>Start a new thread</td>
								</tr>
								<tr>
									<td><kbd>o</kbd></td>
									<td>Open all unread threads</td>
								</tr>
								<tr>
									<td><kbd>f</kbd></td>
									<td>Follow forum</td>
								</tr>
								<tr>
									<td><kbd>m</kbd></td>
									<td>Mark forum read</td>
								</tr>
								<tr>
									<td><kbd>x</kbd></td>
									<td>Show thread preview</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="docs-keygroup">
						<p>Post Lists</p>
						<table>
							<tbody>
								<tr>
									<td><kbd>r</kbd></td>
									<td>Add a new reply</td>
								</tr>
								<tr>
									<td><kbd>q</kbd></td>
									<td>Quote highlighted post</td>
								</tr>
								<tr>
									<td><kbd>l</kbd></td>
									<td>Go to latest unread on current page</td>
								</tr>
								<tr>
									<td><kbd>t</kbd></td>
									<td>Toggle thanks on highlighted post</td>
								</tr>
								<tr>
									<td><kbd>f</kbd></td>
									<td>Follow thread</td>
								</tr>
								<tr>
									<td><kbd>1-9</kbd></td>
									<td>Open the corresponding link</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
				`;
			}
			d.style.display = d.style.display == 'none' ? 'block' : 'none';
		}
	}
}
