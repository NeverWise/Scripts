// ==UserScript==
// @name         Improve Facebook
// @namespace    https://github.com/NeverWise/scripts
// @version      0.2
// @description  Remove annoying elements.
// @author       NeverWise
// @match        https://*.facebook.com/*
// @grant        none
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Facebook_icon_2013.svg/1024px-Facebook_icon_2013.svg.png
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-facebook.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-facebook.user.js
// ==/UserScript==

let rules = [
    { verified: false, selector: 'div._5hn6' },
    { verified: false, selector: 'div#dialog_0.generic_dialog.pop_dialog.generic_dialog_modal' }
];
let timeoutIdLogFunc = null;

let observer = new MutationObserver(mutations => {
    rules.forEach(rule => {
        let element = document.querySelector(rule.selector);
        if (element) {
            element.parentNode.removeChild(element);
            rule.verified = true;
        }
    });

    if (timeoutIdLogFunc) clearTimeout(timeoutIdLogFunc);
    timeoutIdLogFunc = setTimeout(() => {
        rules.forEach(rule => {
            if (!rule.verified) console.log(`Browser extension: Tampermonkey - Script: Improve Facebook - Warning: Selector "${rule.selector}" not found.`);
        });
    }, 5000);
});

observer.observe(document.body,{
    subtree: true,
    childList: true,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false
});
