// ==UserScript==
// @name         Search engines bar for Startpage.com
// @namespace    https://github.com/NeverWise/scripts
// @version      0.8
// @description  Bar with other preferred search engines
// @author       NeverWise
// @match        https://*.startpage.com/*/search*
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=www.startpage.com
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/search-engines-startpage.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/search-engines-startpage.user.js
// ==/UserScript==

let advLinks = document.getElementById('spon-results');
if (advLinks) advLinks.parentNode.removeChild(advLinks);

advLinks = document.querySelector('section.a-gl-tp');
if (advLinks) advLinks.parentNode.removeChild(advLinks);

advLinks = document.querySelector('div#ay-gl-tp.ay-gl-tp');
if (advLinks) advLinks.parentNode.removeChild(advLinks);

advLinks = document.querySelector('div.css-1fgdcyd');
if (advLinks) advLinks.parentNode.removeChild(advLinks);
