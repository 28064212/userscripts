// ==UserScript==
// @name Boardsie Enhancement Suite
// @namespace https://github.com/28064212/userscripts
// @icon https://raw.githubusercontent.com/28064212/userscripts/master/boardsie.png
// @downloadURL https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.js
// @resource css https://github.com/28064212/userscripts/raw/master/boardsie-enhancement-suite.user.css
// @grant GM_getResourceText
// @grant GM.addStyle
// @grant GM.getValue
// @grant GM.setValue
// @include /^https?://(www\.)?boards\.ie/.*/
// @description Enhancements for Boards.ie
// @version 1.5.3
// ==/UserScript==

let index = -1;
let showpreviews = false;
let settings = {};
if (window.top == window.self) {
	GM.addStyle(GM_getResourceText("css"));

	try {
		document.querySelector('#themeFooter').shadowRoot.querySelector('.footer').style.background = "inherit";
		document.querySelector('#themeFooter').shadowRoot.querySelector('.footer').style.color = "inherit";
	}
	catch (e) { }

	(async () => {
		settings = await GM.getValue('settings', {});
		if (settings.autobookmark === undefined)
			settings.autobookmark = true;
		if (settings.keyboard === undefined)
			settings.keyboard = true;
		if (settings.darkmode === undefined)
			settings.darkmode = false;
		if (settings.updatenotice === undefined)
			settings.updatenotice = true;

		if (settings.keyboard)
			window.addEventListener('keydown', keyShortcuts, true);
		if (settings.darkmode)
			document.body.dataset.theme = 'dark'
		if (document.querySelector('#Form_Bookmarked') && settings.autobookmark == false)
			document.querySelector('#Form_Bookmarked').checked = false
		if (settings.updatenotice) {
			settings.updatenotice = false;
			settingsModal();
		}
		await GM.setValue("settings", settings);
	})();

	let categoriesPromise = null;
	//check do we need categories?
	if (true) {
		categoriesPromise = fetch('/api/v2/categories/?limit=500&maxDepth=100')
			.then(response => {
				if (response.ok)
					return response.json();
				else
					throw new Error(response.statusText);
			})
			.then(d => {
				let categories = [];
				flattenCategories(d, categories);
				let order = 0;
				for (let c of categories) {
					c.order = order;
					order += 1;
				}
				return categories;
			})
			.catch(e => console.log(e));
	}

	let titleBar = document.querySelector('#titleBar');
	if (titleBar && titleBar.innerHTML == "") {
		// some pages load titlebar contents lazily
		let observer = new MutationObserver(function (mutationsList, observer) { titleBarObserver(mutationsList, observer, categoriesPromise) });
		observer.observe(titleBar, { childList: true });
	}
	else if (titleBar) {
		addCategoryListing(categoriesPromise);
		menuItems();
	}

	unboldReadThreads();
	removeExternalLinkCheck();
	addThanksAfterPosts();
	addThreadPreviews();
	highlightOP();
	markCategoriesRead(categoriesPromise);

	addBookmarkStatusToComments();
	let profileComments = document.querySelector('.Profile .Comments.DataList');
	if (profileComments) {
		let observer = new MutationObserver(addBookmarkStatusToComments);
		observer.observe(profileComments, { childList: true, subtree: false });
	}
}
function titleBarObserver(mutationList, observer, categoriesPromise) {
	let catLink = document.querySelector("a[to='/categories']");
	if (catLink) {
		// if category link is available, we don't need to monitor anymore
		if (observer)
			observer.disconnect();
		addCategoryListing(categoriesPromise);
		menuItems();
	}
}
function menuItems() {
	let meBox = document.querySelector('.meBox');

	let sep = document.createElement('div');
	sep.classList.add('menu-separator-28064212');
	meBox.insertBefore(sep, meBox.lastElementChild);

	let a = document.createElement('a');
	a.innerHTML = '⚙';
	a.id = 'settings-icon-28064212';
	meBox.insertBefore(a, meBox.lastElementChild);
	a.addEventListener('click', settingsModal);

	a = document.createElement('a');
	a.innerHTML = '⌨';
	a.id = 'docs-icon-28064212';
	meBox.insertBefore(a, meBox.lastElementChild);
	a.addEventListener('click', docsModal);

	sep = document.createElement('div');
	sep.classList.add('menu-separator-28064212');
	meBox.insertBefore(sep, meBox.lastElementChild);
}
async function settingsModal() {
	let settingsModal = document.querySelector('#settings-28064212');
	if (settingsModal) {
		settingsModal.style.display = settingsModal.style.display == 'none' ? 'block' : 'none';
		if (settingsModal.style.display == 'block')
			settingsModal.focus();
		else
			document.activeElement.blur();
	}
	else {
		settingsModal = document.createElement('div');
		settingsModal.id = 'settings-28064212';
		settingsModal.tabIndex = "-1";
		settingsModal.addEventListener('click', function (e) {
			if (e.target == settingsModal)
				e.target.style.display = 'none';
		});
		document.body.appendChild(settingsModal);

		let content = document.createElement('div');
		content.id = 'settings-content-28064212';
		settingsModal.appendChild(content);
		let header = document.createElement("p");
		header.innerHTML = "Boardsie Enhancement Suite";
		content.appendChild(header);

		let updateNotice = document.createElement('p');
		updateNotice.appendChild(document.createTextNode("NOTICE: This script is no longer in development. All support and new features have been moved to the browser extension version. You can see more information about the new extension on this "));
		let updateLink = document.createElement('a');
		updateLink.textContent = "boards thread";
		updateLink.href = 'https://www.boards.ie/discussion/2058208910/boardsie-enhancement-suite-browser-extension/';
		updateLink.style.fontSize = 'inherit';
		updateNotice.appendChild(updateLink);
		updateNotice.appendChild(document.createTextNode(", and by visiting the "));
		let extensionLink = document.createElement('a');
		extensionLink.textContent = "extension homepage";
		extensionLink.href = 'https://github.com/28064212/boardsie-enhancement-suite';
		extensionLink.style.fontSize = 'inherit';
		updateNotice.appendChild(extensionLink);
		updateNotice.appendChild(document.createTextNode('.'))
		content.appendChild(updateNotice);

		let updateNotice2 = document.createElement('p');
		updateNotice2.appendChild(document.createTextNode("This notice will only automatically appear once. However, you can bring it up at any time by clicking the Settings icon (gear-wheel, top-right), or by pressing 's'."));
		updateNotice2.style.fontSize = "16px";
		updateNotice2.style.borderBottom = "1px solid rgb(0, 0, 0, 0.4)";
		content.appendChild(updateNotice2);

		let lhm = document.createElement("div");
		lhm.innerHTML = "<p>Behaviour</p>";
		content.appendChild(lhm);

		let behaviours = document.createElement('div');
		behaviours.classList.add("settings-values-28064212");
		behaviours.id = "settings-behaviours-28064212";
		content.appendChild(behaviours);
		behaviours.innerHTML += '<p><input type="checkbox" id="settings-darkmode-28064212" /><label for="settings-darkmode-28064212">Dark Mode</label></p>';
		behaviours.innerHTML += '<p><input type="checkbox" id="settings-autobookmark-28064212" /><label for="settings-autobookmark-28064212">Automatically set "Bookmark this discussion"</label></p>';
		behaviours.innerHTML += '<p><input type="checkbox" id="settings-keyboard-28064212" /><label for="settings-keyboard-28064212">Enable keyboard shortcuts</label></p>';

		let keyboard = behaviours.querySelector('#settings-keyboard-28064212');
		keyboard.checked = settings.keyboard;
		keyboard.addEventListener('change', async function (e) {
			settings.keyboard = keyboard.checked;
			if (settings.keyboard)
				window.addEventListener('keydown', keyShortcuts, true);
			else
				window.removeEventListener('keydown', keyShortcuts, true);
			await GM.setValue("settings", settings);
		});

		let darkmode = behaviours.querySelector('#settings-darkmode-28064212');
		darkmode.checked = settings.darkmode;
		darkmode.addEventListener('change', async function (e) {
			settings.darkmode = darkmode.checked;
			if (settings.darkmode)
				document.body.dataset.theme = 'dark';
			else
				delete document.body.dataset.theme;
			await GM.setValue("settings", settings);
		});

		let autoBookmark = behaviours.querySelector('#settings-autobookmark-28064212');
		autoBookmark.checked = settings.autobookmark;
		autoBookmark.addEventListener('change', async function (e) {
			settings.autobookmark = autoBookmark.checked;
			if (document.querySelector('#Form_Bookmarked') && settings.autobookmark == false)
				document.querySelector('#Form_Bookmarked').checked = false
			await GM.setValue("settings", settings);
		});

		settingsModal.focus();
	}
}
function docsModal() {
	let docsModal = document.querySelector('#docs-28064212');
	if (docsModal == null) {
		docsModal = document.createElement('div');
		docsModal.id = 'docs-28064212';
		docsModal.style.display = 'none';
		docsModal.addEventListener('click', function (e) {
			if (e.target == docsModal)
				e.target.style.display = 'none';
		});
		document.body.appendChild(docsModal);
		docsModal.innerHTML = `
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
						<td><kbd>s</kbd></td>
						<td>Toggle settings menu</td>
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
						<td><kbd>c</kbd></td>
						<td>Display category menu</td>
					</tr>
					<tr>
						<td><kbd>ctrl</kbd><kbd>space</kbd></td>
						<td>Focus on search box</td>
					</tr>
					<tr>
						<td><kbd>esc</kbd></td>
						<td>Close settings/documentation</td>
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
	</div>`;
	}
	docsModal.style.display = docsModal.style.display == 'none' ? 'block' : 'none';
}
function flattenCategories(data, categories) {
	for (let d of data) {
		categories.push({ "id": d.categoryID, "parent": d.parentCategoryID, "name": d.name, "slug": d.urlcode, "followed": d.followed, "depth": d.depth, "url": d.url });
		if (d.children && d.children.length > 0)
			flattenCategories(d.children, categories)
	}
}
function markCategoriesRead(categoriesPromise) {
	let catFollowedPage = new URL(window.location).pathname == '/categories' && document.querySelector('.selectBox-selected').textContent == 'Following';
	let listed = document.querySelectorAll("h2.CategoryNameHeading a");
	for (let l of listed) {
		l.style.opacity = "0.1";
	}
	categoriesPromise.then(categories => {
		if (catFollowedPage) {
			// display all followed on categories page
			let followed = categories.filter(c => c.followed);
			let listedArray = Array.from(listed);
			for (let f of followed) {
				if (!listedArray.find(a => a.href == f.url)) {
					let row = document.createElement('tr');
					row.innerHTML = `<tr class="">
					<td>
						<div class="spritethreadbit spritethreadbit-threadunread" title="Thread has no unread posts"></div>
					</td>
					<td id="CategoryName">
						<div class="Wrap">
							<h2 aria-level='3' class='CategoryNameHeading'><a href="`+ f.url + `" class="threadbit-threadlink">` + f.name + `</a></h2>
						</div>
					</td>
					<td class="forum-threadlist-lastpost">
						<div class="Block Wrap"><div>
					</td>
					<td class="forum-threadlist-replies">
						<div class="Wrap"></div>
					</td>
					<td class="forum-threadlist-replies">
						<div class="Wrap"></div>
					</td>
				</tr>`;
					document.querySelector('.forum-threadlist-table tbody').appendChild(row);
				}
			}
			let rows = Array.from(document.querySelectorAll('.forum-threadlist-table tbody tr'));
			rows.sort(function (a, b) {
				let first = followed.find(f => f.url == a.querySelector('.CategoryNameHeading a').href);
				let second = followed.find(f => f.url == b.querySelector('.CategoryNameHeading a').href);
				if (first === undefined)
					return 1;
				else if (second === undefined)
					return -1;
				else
					return first.order - second.order;
			});
			for (let r of rows) {
				document.querySelector('.forum-threadlist-table tbody').appendChild(r);
			}
		}
		listed = document.querySelectorAll("h2.CategoryNameHeading a"); // need to get the newly added rows
		for (let l of listed) {
			let slug = (new URL(l.href)).pathname.replace("/categories/", "");
			if (categories.find(o => o.slug == slug)) {
				fetch('/api/v2/discussions/?categoryID=' + categories.find(o => o.slug == slug).id + '&sort=-dateLastComment&pinOrder=mixed')
					.then(response => {
						if (response.ok)
							return response.json();
						else
							throw new Error(response.statusText);
					})
					.then(d => {
						let unread = d.find(o => o.unread);
						if (!unread)
							l.style.fontWeight = "normal";
						// add last post to manually added rows
						let row = l.parentElement.parentElement.parentElement.parentElement;
						if (row.querySelector('.forum-threadlist-lastpost .Block').querySelector("a") == null) {
							let lastPost = new Date(d[0].dateLastComment);
							let lastPostFormatted = ("0" + lastPost.getDate()).slice(-2) + "-" + ("0" + (lastPost.getMonth() + 1)).slice(-2) + "-" + lastPost.getFullYear().toString().slice(-2) + " " + ("0" + lastPost.getHours()).slice(-2) + ":" + ("0" + lastPost.getMinutes()).slice(-2);
							row.querySelector('.forum-threadlist-lastpost .Block').innerHTML = `<a href="` + d[0].url + `#latest" class="BlockTitle LatestPostTitle" title="` + d[0].name + `">` + d[0].name + `</a>
						<div class="Meta">
							<span>in <a href="` + l.href + `">` + l.textContent + `</a></span>
						</div>
						<div class="forum-threadlist-thread-lastpost">` + lastPostFormatted + `</div>
						<div class="forum-threadlist-thread-lastposter">
							<a title="View latest post" href="` + d[0].url + `#latest">
								<div class="spritethreadbit spritethreadbit-latestpost"></div>
							</a>
							<a class="threadbit-lastposter" href="` + d[0].insertUser.url + `" title="View profile for">` + d[0].insertUser.name + `</a>
						</div>`;
						}
						l.style.transition = "opacity 750ms linear";
						l.style.opacity = "1";
					})
					.catch(e => console.log(e));
			}
		}
	});
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
	if (discussions.length > 0) {
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
					let d = data.find(n => n.discussionID == id);
					if (d) {
						let preview = document.createElement("div");
						preview.classList.add("preview-28064212");
						preview.innerHTML = d.body ? d.body : "";
						preview.style.display = "none";
						let parent = null;
						if (l.parentElement.classList.contains("threadlink-wrapper")) {
							parent = l.parentElement.parentElement;
							preview.style.top = '28px';
							parent.appendChild(preview);
							preview.parentElement.title = '';
							// unbolds read threads on homepage
							if (d.unread == false) {
								l.style.fontWeight = "normal";
							}
						}
						else {
							parent = l.parentElement;
							preview.style.top = '46px';
							parent.appendChild(preview);
						}
						l.addEventListener('mouseover', function (e) {
							preview.style.display = "block";
						});
						l.addEventListener('mouseout', function (e) {
							preview.style.display = "none";
						});

						if (d.bookmarked) {
							let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
							svg.setAttribute("viewBox", "0 0 12.733 16.394");
							svg.innerHTML = '<title>Bookmark</title><path class="svgBookmark-mainPath" stroke-width="2" d="M1.05.5H11.683a.55.55,0,0,1,.55.55h0V15.341a.549.549,0,0,1-.9.426L6.714,12a.547.547,0,0,0-.7,0L1.4,15.767a.55.55,0,0,1-.9-.426V1.05A.55.55,0,0,1,1.05.5z"></path>';
							svg.style.height = "16px";
							svg.style.width = "12px";
							svg.style.float = "right";
							svg.style.marginLeft = "10px";
							svg.querySelector('path').style.stroke = "rgb(59, 85, 134)";
							svg.querySelector('path').style.fill = "rgb(59, 85, 134)";
							parent.insertBefore(svg, parent.querySelector('.Category, .oplink-wrapper'));
						}

						if (l.classList.contains("threadbit-threadlink")) {
							try {
								let row = l.parentElement.parentElement;
								let cell = row.lastElementChild;
								cell.className = "";
								let firstPost = new Date(d.dateInserted);
								let firstPostFormatted = ("0" + firstPost.getDate()).slice(-2) + "-" + ("0" + (firstPost.getMonth() + 1)).slice(-2) + "-" + firstPost.getFullYear().toString().slice(-2) + " " + ("0" + firstPost.getHours()).slice(-2) + ":" + ("0" + firstPost.getMinutes()).slice(-2);
								cell.innerHTML = '<div style="float:right">' +
									'<a title="View first post" href="' + d.url + '"><div class="spritethreadbit spritethreadbit-latestpost"></div></a> ' +
									'<a class="threadbit-lastposter" href="' + d.insertUser.url + '">' + d.insertUser.name + '</a></div><div>' + firstPostFormatted + '</div>';
								row.removeChild(cell);
								row.insertBefore(cell, row.lastElementChild);
								let table = l.closest('table:not(firstpost-added-28064212)');
								if (table) {
									table.querySelector('th.forum-threadlist-replies').innerHTML = 'First post';
									//need to set a clasee, then width 17%
									table.querySelector('th.forum-threadlist-views').innerHTML = 'Replies';
									table.classList.add('firstpost-added-28064212');
								}
							}
							catch (e) { console.log(e) }
						}
					}
				}
			})
			.catch(error => console.log(error));
	}
}
function addThanksAfterPosts() {
	for (let post of document.querySelectorAll('.ItemComment, .ItemDiscussion')) {
		if (post.classList.contains('ItemDiscussion') && post.querySelector('.HasCount')) {
			let id = gdn.meta.DiscussionID;
			appendThanks(post, 'discussions', id);
		}
		else if (post.querySelector('.HasCount')) {
			let id = post.id.replace('Comment_', '');
			appendThanks(post, 'comments', id);
		}
	}
}
function appendThanks(element, type, id) {
	fetch('/api/v2/' + type + '/' + id + '/reactions?limit=100&type=Like')
		.then(response => {
			if (response.ok)
				return response.json();
			else
				throw new Error(response.statusText);
		})
		.then(data => {
			let thankscontainer = document.createElement('div');
			thankscontainer.classList.add('thanks-28064212')
			element.appendChild(thankscontainer);

			let thankscount = document.createElement('div');
			thankscount.innerText = "Thanks (" + data.length + ")";
			thankscontainer.appendChild(thankscount);

			data.sort(function (a, b) {
				return a.user.name.toLowerCase().localeCompare(b.user.name.toLowerCase());
			});
			let thankers = document.createElement('div');
			thankscontainer.appendChild(thankers);
			for (let d of data) {
				let link = document.createElement('a');
				link.href = d.user.url;
				link.innerHTML = d.user.name;
				thankers.appendChild(link);
				thankers.innerHTML += ", ";
			}
			thankers.innerHTML = thankers.innerHTML.slice(0, -2);
		})
		.catch(error => console.log(error));
}
function highlightOP() {
	if (gdn.meta.DiscussionID) {
		let userid = gdn.meta.eventData.discussion.discussionUser.userID;
		let posts = document.querySelectorAll("span[data-dropdown='user" + userid + "-menu']");
		for (let p of posts)
			p.parentElement.classList.add('original-poster-28064212');
	}
}
function addBookmarkStatusToComments() {
	let commentElements = document.querySelectorAll('.Profile .Comments .Item:not(.bookmark-status-28064212)');
	let commentList = [];
	for (let c of commentElements)
		commentList.push(c.id.replace("Comment_", ""));
	if (commentList.length > 0) {
		fetch('/api/v2/comments/?limit=500&commentId=' + commentList.join(','))
			.then(response => {
				if (response.ok)
					return response.json();
				else
					throw new Error(response.statusText);
			})
			.then(commentData => {
				let discussionList = [];
				for (let d of commentData)
					discussionList.push(d.discussionID);
				if (discussionList.length > 0) {
					fetch('/api/v2/discussions/?limit=500&discussionID=' + discussionList.join(','))
						.then(response => {
							if (response.ok)
								return response.json();
							else
								throw new Error(response.statusText);
						})
						.then(discussionData => {
							for (let c of commentElements) {
								let id = c.id.replace("Comment_", "");
								let discussion = commentData.find(item => item.commentID == id).discussionID;
								let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
								svg.setAttribute("viewBox", "0 0 12.733 16.394");
								svg.innerHTML = '<title>Bookmark</title><path class="svgBookmark-mainPath" stroke-width="2" d="M1.05.5H11.683a.55.55,0,0,1,.55.55h0V15.341a.549.549,0,0,1-.9.426L6.714,12a.547.547,0,0,0-.7,0L1.4,15.767a.55.55,0,0,1-.9-.426V1.05A.55.55,0,0,1,1.05.5z"></path>';
								svg.style.height = "16px";
								svg.style.width = "12px";
								svg.style.float = "right";
								svg.style.marginLeft = "10px";
								svg.querySelector('path').style.stroke = "rgb(59, 85, 134)";
								if (discussionData.find(item => item.discussionID == discussion).bookmarked)
									svg.querySelector('path').style.fill = "rgb(59, 85, 134)";
								else
									svg.querySelector('path').style.fill = "none";
								c.querySelector(".ItemContent").insertBefore(svg, c.querySelector(".ItemContent").firstChild);
								c.classList.add("bookmark-status-28064212");

								let score = commentData.find(item => item.commentID == id) ? commentData.find(item => item.commentID == id).score : null;
								if (score) {
									let s = document.createElement('span');
									s.className = 'MItem';
									s.style.float = "right";
									s.textContent = '(' + score + ')';
									c.querySelector('.Meta').appendChild(s);
								}
							}
						})
						.catch(error => console.log(error));;
				}
			})
			.catch(error => console.log(error));
	}
}
function addCategoryListing(categoriesPromise) {
	categoriesPromise.then(data => {
		let catLink = document.querySelector("a[to='/categories']");
		let categories = document.createElement("div");
		categories.id = "categories-28064212";
		categories.style.display = "none";
		categories.tabIndex = -1;
		document.body.appendChild(categories);

		catLink.parentElement.addEventListener("mouseover", function () {
			categories.style.display = "block";
		});
		categories.addEventListener("mouseleave", function () {
			categories.style.display = "none";
			for (let i of document.querySelectorAll("#categories-header-28064212 a")) {
				i.style.backgroundColor = "";
				i.style.color = "";
			}
			for (let i of document.querySelectorAll('.categories-division-28064212 a')) {
				i.style.display = 'none';
			}
		});
		let categoriesHeader = document.createElement("div");
		categoriesHeader.id = "categories-header-28064212";
		categories.appendChild(categoriesHeader);

		let group = document.createElement("div");
		group.classList.add("categories-group-28064212");
		group.style.display = "grid";
		categories.appendChild(group);

		for (let i = 2; i < 8; i++) {
			let division = document.createElement("div");
			division.classList.add("categories-division-28064212");
			division.dataset.depth = i;
			group.appendChild(division);
		}

		data.unshift({ "id": 0, "parent": null, "followed": false, "name": "Followed", "url": "/categories?followed=1", "slug": "followed", "depth": 1 });
		for (let d of data.filter(o => o.depth == 1)) {
			let header = document.createElement("a");
			header.dataset.id = d.id;
			header.innerText = d.name;
			header.href = d.url;
			categoriesHeader.appendChild(header);

			header.addEventListener("mouseover", function () {
				//clear all divisions, populate children
				for (let i of document.querySelectorAll('.categories-division-28064212 a')) {
					if (i.dataset.parent == d.id)
						i.style.display = 'block';
					else
						i.style.display = 'none';
				}
				// style current header, reset others
				for (let i of document.querySelectorAll("#categories-header-28064212 a")) {
					i.style.backgroundColor = "";
					i.style.color = "";
				}
				header.style.backgroundColor = "rgb(59, 85, 134)";
				header.style.color = "white";
			});
		}
		let links = data.filter(f => f.depth > 1);
		for (let l of links) {
			let childLink = document.createElement('a');
			childLink.dataset.id = l.id;
			childLink.dataset.parent = l.parent;
			childLink.innerText = l.name;
			childLink.href = l.url;
			if (data.filter(c => c.parent == l.id).length > 0) {
				let arrow = document.createElement("div");
				arrow.innerText = "⇒";
				arrow.style.float = "right";
				childLink.appendChild(arrow);
			}
			document.querySelectorAll('.categories-division-28064212')[l.depth - 2].appendChild(childLink);

			childLink.addEventListener("mouseover", function () {
				for (let i = l.depth + 1; i < 8; i++) {
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
				for (let i of document.querySelectorAll('.categories-division-28064212 a[data-parent="' + l.id + '"]'))
					i.style.display = "block";
			});
		}
		links = data.filter(f => f.followed);
		links.sort(function (a, b) {
			return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
		});
		for (let l of links) {
			let childLink = document.createElement('a');
			childLink.dataset.id = l.id;
			childLink.dataset.parent = 0;
			childLink.innerText = l.name;
			childLink.href = l.url;
			document.querySelectorAll('.categories-division-28064212')[0].appendChild(childLink);
		}
	});
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
	let intext = (document.activeElement.nodeName == 'TEXTAREA' || (document.activeElement.nodeName == 'INPUT' && document.activeElement.type != 'checkbox') || document.activeElement.contentEditable == "true");
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
		else if (!ctrl && code == 67) {
			// c - display category menu
			window.scrollTo(0, 0);
			document.querySelector("a[to='/categories']").parentElement.dispatchEvent(new Event('mouseover'));
			document.querySelector("#categories-28064212").focus();
		}
		else if (!ctrl && code == 70) {
			// f - follow/unfollow
			if (document.querySelector('a.Bookmark')) {
				if (document.querySelector('a.Bookmarked'))
					createAlert("Thread unfollowed");
				else
					createAlert("Discussion bookmarked");
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
		else if (!ctrl && code == 76 && document.querySelector('#latest')) {
			// l - scroll to latest
			document.querySelector('#latest').scrollIntoView();
		}
		else if (!ctrl && code == 77) {
			// m - Mark forum read
			if (document.querySelector('meta[name=catid]')) {
				let category = document.querySelector('meta[name=catid]').content;
				let transientKey = gdn.meta.TransientKey;
				fetch("/category/markread?categoryid=" + category + "&tkey=" + transientKey)
					.then(createAlert("Marked read"))
					.then(d => {
						for (let u of document.querySelectorAll(".unread"))
							u.classList.remove("unread")
					});
			}
		}
		else if (!ctrl && code == 79) {
			// o - open all unread threads
			let threads = document.querySelectorAll('.forum-threadlist-thread');
			for (let t of threads) {
				if (t.querySelector('.HasNew'))
					window.open(t.querySelector('a'));
			}
		}
		else if (!ctrl && code == 80 && hl && hl.getElementsByClassName('customspamlink').length > 0) {
			// p - Report spammer (if https://github.com/28064212/greasemonkey-scripts/raw/master/Boards.ie%20-%20Quick%20Spam%20Reporting.user.js also installed)
			window.open(hl.getElementsByClassName('customspamlink')[0]);
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
		else if (!ctrl && code == 83) {
			// s - show/hide settings
			settingsModal();
		}
		else if (!ctrl && code == 84 && hl && hl.querySelector('.ReactButton-Like')) {
			// t - toggle thanks of highlighted post
			hl.querySelector('.ReactButton-Like').click();
		}
		else if (!ctrl && code == 88) {
			// x - toggle previews display
			showpreviews = !showpreviews;
			if (hl.querySelector(".preview-28064212"))
				hl.querySelector(".preview-28064212").style.display = showpreviews ? "block" : "none";
		}
		else if (!ctrl && hl && code >= 48 && code <= 57) {
			// 0-9: open links
			code = code == 48 ? 10 : code - 49;
			if (hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)').length > 0 && hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code])
				window.open(hl.querySelectorAll('.postbit-postbody a:not(.ReactButton)')[code]);
		}
		else if (!ctrl && code == 27) {
			// esc - close settings/documentation
			if (document.querySelector('#settings-28064212'))
				document.querySelector('#settings-28064212').style.display = "none";
			if (document.querySelector('#docs-28064212'))
				document.querySelector('#docs-28064212').style.display = "none";
		}
		else if (shift && code == 191) {
			// ? - show/hide documentation
			docsModal();
		}
	}
}
