// ==UserScript==
// @name        Tesco - Clubcard Deals
// @namespace   https://github.com/28064212/greasemonkey-scripts
// @downloadURL https://github.com/28064212/greasemonkey-scripts/raw/master/Tesco%20-%20Clubcard%20Deals.user.js
// @include     http://www.mobeo-deals.net/tescodeals/*
// @include     https://www.mobeo-deals.net/tescodeals/*
// @version     1
// @grant       none
// ==/UserScript==

var field0 = document.getElementsByName("OnlineCode1")[0];
var field1 = document.getElementsByName("OnlineCode2")[0];
field0.onkeydown = null;
field1.onkeydown = null;
field0.onpaste = null;
field1.onpaste = null;
