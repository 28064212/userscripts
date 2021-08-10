// ==UserScript==
// @name Boardsie Enhancement Suite
// @namespace https://github.com/28064212/userscripts
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @downloadURL https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.js
// @resource css https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.css
// @grant GM_getResourceText
// @grant GM_addStyle
// @include /^https?://(www\.)?boards\.ie/.*/
// @description Enhancements for Boards.ie
// @version 1.2.5
// ==/UserScript==

let index = -1;
let showpreviews = false;
if (window.top == window.self) {
	let css = GM_getResourceText("css");
	GM_addStyle(css);
	window.addEventListener('keydown', keyShortcuts, true);

	let target = document.querySelector('#titleBar');
	if (target && target.innerHTML == "") {
		// some pages load titlebar contents lazily
		let observer = new MutationObserver(addCategoryListing);
		observer.observe(target, { childList: true });
	}
	else if (target) {
		addCategoryListing();
	}

	unboldReadThreads();
	removeExternalLinkCheck();
	addThanksAfterPosts();
	addThreadPreviews();
}
function unboldReadThreads() {
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
function addThreadPreviews() {
	let links = document.querySelectorAll('a.threadbit-threadlink, .threadlink-wrapper a');
	let discussions = [];
	for (let l of links) {
		let path = new URL(l.href).pathname.replace('/discussion/', '');
		let id = path.slice(0, path.indexOf('/'));
		if (id != "")
			discussions.push(id);
	}
	fetch('/api/v2/discussions/?limit=500&discussionID=' + discussions.join(','))
		.then(response => {
			if (response.ok)
				return response.json();
			else
				throw new Error(response.statusText);
		})
		.then(data => {
			for (let l of links) {
				let path = new URL(l.href).pathname.replace('/discussion/', '');
				let id = path.slice(0, path.indexOf('/'));
				for (let d of data) {
					if (d.discussionID == id) {
						let preview = document.createElement("div");
						let parent = null;
						if (l.parentElement.classList.contains("threadlink-wrapper")) {
							parent = l.parentElement.parentElement;
							parent.appendChild(preview);
							preview.parentElement.title = '';
						}
						else {
							parent = l.parentElement;
							parent.appendChild(preview);
						}
						preview.classList.add("preview-28064212");
						preview.innerHTML = d.body ? d.body : "";
						preview.style.display = "none";
						preview.style.top = (parent.offsetHeight + 1) + 'px';
						l.addEventListener('mouseover', function (e) {
							preview.style.display = "block";
						});
						l.addEventListener('mouseout', function (e) {
							preview.style.display = "none";
						});
					}
				}
			}
		})
		.catch(error => { });

}
function addThanksAfterPosts() {
	let starter = document.querySelector('.ItemDiscussion');
	if (starter && starter.querySelector('.HasCount')) {
		let discussionid = gdn.meta.DiscussionID;
		fetch('/api/v2/discussions/' + discussionid + '/reactions?limit=100&type=Like')
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
function addCategoryListing(mutationList, observer) {
	let catLink = document.querySelector("a[to='/categories']");
	if (catLink) {
		if (observer) {
			// category link is available, don't need to monitor anymore
			observer.disconnect();
		}
		let categories = document.createElement("div");
		categories.id = "categories-28064212";
		categories.style.display = "none";
		document.body.appendChild(categories);

		let loader = document.createElement("div");
		loader.id = "categories-loader-28064212";
		categories.appendChild(loader);

		catLink.parentElement.addEventListener("mouseover", function () {
			categories.style.display = "block";
			if (categories.querySelector("#categories-header-28064212") == null) {
				let categoriesHeader = document.createElement("div");
				categoriesHeader.id = "categories-header-28064212";
				categories.appendChild(categoriesHeader);
				fetch('/api/v2/categories/?limit=500&maxDepth=100')
					.then(response => {
						if (response.ok)
							return response.json();
						else
							throw new Error(response.statusText);
					})
					.then(data => {
						for (let d of data) {
							loader.style.display = "none";
							let header = document.createElement("a");
							header.dataset.id = d.categoryID;
							header.innerText = d.name;
							header.href = d.url;
							categoriesHeader.appendChild(header);

							let group = document.createElement("div");
							group.classList.add("categories-group-28064212");
							group.style.display = "none";
							group.dataset.parent = d.categoryID;
							categories.appendChild(group);

							header.addEventListener("mouseover", function () {
								// hide all groups, then display the correct one
								for (let i of document.querySelectorAll(".categories-group-28064212"))
									i.style.display = "none";
								group.style.display = "grid";

								// style current header, reset others
								for (let i of document.querySelectorAll("#categories-header-28064212 a")) {
									i.style.backgroundColor = "";
									i.style.color = "";
								}
								header.style.backgroundColor = "rgb(59, 85, 134)";
								header.style.color = "white";
							});

							for (let i = 0; i < 6; i++) {
								let division = document.createElement("div");
								division.classList.add("categories-division-28064212");
								division.dataset.depth = i;
								group.appendChild(division);
							}
							if (d.children.length > 0)
								populateCategoryChildren(d, d.categoryID, 0);
						}
					});
			}
		});
		categories.addEventListener("mouseleave", function () {
			categories.style.display = "none";
			for (let i of document.querySelectorAll(".categories-group-28064212"))
				i.style.display = "none";
			for (let i of document.querySelectorAll("#categories-header-28064212 a")) {
				i.style.backgroundColor = "";
				i.style.color = "";
			}
		});
	}
}
function populateCategoryChildren(target, root, depth) {
	for (let c of target.children) {
		let childLink = document.createElement('a');
		childLink.dataset.id = c.categoryID;
		childLink.dataset.parent = c.parentCategoryID;
		childLink.innerText = c.name;
		childLink.href = c.url;
		document.querySelector('.categories-group-28064212[data-parent="' + root + '"]').querySelectorAll('.categories-division-28064212')[depth].appendChild(childLink);
		childLink.addEventListener("mouseover", function () {
			for (let i = depth + 1; i < 6; i++) {
				// hide items from divisions greater than depth
				for (let j of document.querySelectorAll('.categories-division-28064212[data-depth="' + i + '"] a'))
					j.style.display = "none";
				// remove style from links in divisions greater than or equal to depth
				for (let j of document.querySelectorAll('.categories-division-28064212[data-depth="' + (i - 1) + '"] a')) {
					j.style.backgroundColor = "";
					j.style.color = "";
				}
			}
			childLink.style.backgroundColor = "rgb(59, 85, 134)";
			childLink.style.color = "white";
			for (let i of document.querySelectorAll('.categories-division-28064212 a[data-parent="' + c.categoryID + '"]'))
				i.style.display = "block";
		});
		if (c.children.length > 0) {
			let arrow = document.createElement("div");
			arrow.innerText = "⇒";
			arrow.style.float = "right";
			childLink.appendChild(arrow);
			populateCategoryChildren(c, root, depth + 1)
		}
	}
}
function createAlert(msg) {
	for (let a of document.querySelectorAll(".alert-28064212")) {
		a.style.opacity = 0;
	}
	let alertBox = document.querySelector(".InformMessages");
	if (alertBox == null) {
		alertBox = document.createElement("div");
		alertBox.classList.add("InformMessages");
		document.body.appendChild(alertBox);
	}
	let alert = document.createElement("div");
	alert.className = "InformWrapper Dismissable AutoDismiss alert-28064212";
	alert.innerHTML = `
<div role="alert" class="InformMessage">
<span aria-label="polite" class="InformMessageBody">
	<div class="Title">` + msg + `</div>
</span>
</div>`;
	alertBox.appendChild(alert);
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
			if (document.querySelector('a.Bookmark')) {
				if (document.querySelector('a.Bookmarked'))
					createAlert("Thread unfollowed");
				else
					createAlert("Thread followed");
				document.querySelector('a.Bookmark').click();
			}
			else if (document.querySelector("button[aria-label='Follow'], button[aria-label='Unfollow']")) {
				let category = document.querySelector('meta[name=catid]').content;
				let user = gdn.meta.ui.currentUser.userID;
				fetch("/api/v2/categories/" + category + "/preferences/" + user)
					.then(response => {
						if (response.ok)
							return response.json();
						else
							throw new Error(response.statusText);
					})
					.then(data => {
						let toggle = data.postNotifications ? null : "follow";
						fetch("/api/v2/categories/" + category + "/preferences/" + user, {
							method: "PATCH", body: JSON.stringify({ postNotifications: toggle }), headers: { "Content-type": "application/json; charset=UTF-8" }
						})
							.then(response => {
								if (response.ok) {
									//alert
									createAlert(toggle == "follow" ? "Forum followed" : "Forum unfollowed");
									return response.json();
								}
								else
									throw new Error(response.statusText);
							})
							.catch(e => console.log(e));
					})
					.catch(e => console.log(e));
			}
		}
		else if (!ctrl && hl && code >= 48 && code <= 57) {
			// 0-9: open links
			code = code == 48 ? 10 : code - 49;
			if (hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)').length > 0 && hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code])
				window.open(hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code]);
		}
		else if (!ctrl && code == 77) {
			// m - Mark forum read
			let transientKey = gdn.meta.TransientKey;
			let category = document.querySelector('meta[name=catid]').content;
			fetch("/category/markread?categoryid=" + category + "&tkey=" + transientKey)
				.then(createAlert("Forum marked read, refresh to update"));
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
			else if (document.querySelector(".BoxNewDiscussion a"))
				document.querySelector(".BoxNewDiscussion a").click();
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
