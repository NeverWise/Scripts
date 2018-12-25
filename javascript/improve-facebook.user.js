// ==UserScript==
// @name         Improve Facebook
// @namespace    https://github.com/NeverWise/scripts
// @version      0.1
// @description  Remove annoying elements.
// @author       NeverWise
// @match        https://www.facebook.com/*
// @grant        none
// @icon         https://scontent.fmxp1-1.fna.fbcdn.net/v/t1.0-0/p370x247/10407291_660920887306623_6175074563602962791_n.png?_nc_cat=101&_nc_ht=scontent.fmxp1-1.fna&oh=9b58f7238d70c3611538a87e8b5760af&oe=5CA22E43
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
