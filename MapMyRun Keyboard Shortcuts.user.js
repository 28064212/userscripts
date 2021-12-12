// ==UserScript==
// @name        MapMyRun Keyboard Shortcuts
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @match       https://www.mapmyrun.com/routes/view/*
// @match       https://www.mapmyrun.com/workout/*
// @match       https://www.mapmyrun.com/routes/my_routes/
// @match       https://www.mapmyrun.com/activity_feed*
// @downloadURL https://github.com/28064212/userscripts/raw/master/MapMyRun%20Keyboard%20Shortcuts.user.js
// @version     1.4.7
// @grant       none
// ==/UserScript==

if (window.top == window.self) {
    window.addEventListener('keydown', keyShortcuts, true);
}

function keyShortcuts(key) {
    var code = key.keyCode;
    var ctrl = key.ctrlKey;
    var alt = key.altKey;
    if (code == 32 && ctrl) {
        // Ctrl+Space on workout edit to clear route and focus
        document.getElementsByTagName('button')[0].click();
        document.getElementsByClassName('routeSelector-25BXq')[0].getElementsByTagName("input")[0].focus();
        key.preventDefault();
    }
    else if (code == 65 && ctrl) {
        // Ctrl+A to focus on Notes
        document.getElementsByClassName('input-2iIsn')[0].focus();
        document.getElementsByClassName('input-2iIsn')[0].scrollIntoView();
        key.preventDefault();
    }
    else if (code == 83 && ctrl) {
        // Ctrl+S on workout edit to save
        document.getElementsByClassName('saveButtonContainer-3_WXK')[0].getElementsByTagName('button')[0].click();
        key.preventDefault();
    }
    else if (code == 13 || (code >= 49 && code <= 57)) {
        if (window.location.href.indexOf('/workout/') != -1 && window.location.href.indexOf('/edit/') == -1) {
            // 1-9 to view workout
            navigator.clipboard.writeText(window.location.toString());
            document.location = window.location.toString().replace("workout", "workout/edit");
        }
        else if (window.location.href.indexOf('activity_feed') != -1) {
            // 1-9 to open workouts
            key.preventDefault();
            var workouts = document.getElementsByClassName('row-ZtOZv');
            code = code == 13 ? 49 : code; // set enter = 1
            var num = code - 49;
            if (workouts.length > 0 && num + 1 <= workouts.length) {
                var evt = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: ctrl });
                workouts[num].getElementsByTagName("a")[0].dispatchEvent(evt);
            }
        }
        else {
            if (document.activeElement.nodeName !== "INPUT") {
                var oks = Array.prototype.slice.call(document.getElementsByTagName('span')).filter(el => el.textContent.trim() === 'OK');
                if (oks.length > 0) {
                    // confirm deletion
                    oks[0].click();
                }
                else {
                    // 1/Enter-9 to delete routes
                    var dels = Array.prototype.slice.call(document.getElementsByTagName('a')).filter(el => el.textContent.trim() === 'Delete');
                    code = code == 13 ? 49 : code; // set enter = 1
                    var num = code - 49;
                    if (dels.length > 0 && num + 1 <= dels.length) {
                        dels[num].click();
                    }
                }
            }
        }
    }
}