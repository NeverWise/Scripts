// ==UserScript==
// @name         Improve Libero mail
// @namespace    https://github.com/NeverWise/scripts
// @version      0.6
// @description  Remove ads and show some useful information.
// @author       NeverWise
// @match        https://mail1.libero.it/appsuite/*
// @grant        none
// @icon         https://mail1.libero.it/appsuite/v=7.8.3-42.20180801.125422/apps/themes/libero/icon57.png
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-libero-mail.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-libero-mail.user.js
// ==/UserScript==

let log = msg => { console.log(`Browser extension: Tampermonkey - Script: Improve Libero mail - ${msg}.`); };
let logInfo = msg => { log(`Info: ${msg}`); };
let logWarning = msg => { log(`Warning: ${msg}`); };
let logError = msg => { log(`Error: ${msg}`); };

let removeClass = (element, className) => {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
        return true;
    }
    else return false;
};

let removeElement = element => {
    if (element) {
        element.parentNode.removeChild(element);
        return true;
    }
    return false;
};

let setStyleProperty = (element, property, strValue, pseudoElement) => {
    if (window.getComputedStyle(element, pseudoElement).getPropertyValue(property) !== strValue) {
        element.style[property] = strValue;
        return true;
    }
    else return false;
};

let addFolderBadge = elements => {
    let result = false;
    if (elements.length) {
        let showCounterClass = 'show-counter';
        elements.forEach(element => {
            let tooltip = element.getAttribute('title');
            if (tooltip) {
                let patt = new RegExp('(\\d+)', 'g');
                let nums = [];
                do {
                    let match = patt.exec(tooltip);
                    if (match) nums.push(match[0]);
                } while (patt.lastIndex);
                if (nums.length > 0 && nums[0] > 0) {
                    if (element.querySelector('.folder-arrow.invisible')) { // This node doesn't contains other folders.
                        let counters = element.getElementsByClassName('folder-counter');
                        if (counters.length === 1) {
                            let folder_counter = counters[0];
                            let badge_bg_color = '';
                            let badge_content = nums[0];
                            if (nums.length === 2) {
                                badge_content = `${nums[1]} | ${nums[0]}`;
                                if (parseInt(nums[1]) > 0) badge_bg_color = 'background-color: #16548f;';
                            }
                            let lbl = `<span class="badge" style="color:#fff;${badge_bg_color}">${badge_content}</span>`;
                            result = setStyleProperty(folder_counter, 'float', 'right', null);
                            if (folder_counter.innerHTML != lbl) {
                                folder_counter.innerHTML = lbl;
                                result = true;
                            }
                            if (!element.classList.contains(showCounterClass)) {
                                element.classList.add(showCounterClass);
                                result = true;
                            }
                        }
                    }
                }
            }
        });
    }
    return result;
};

let checkWindowsBodies = elements => {
    let result = false;
    if (elements.length) {
        elements.forEach(element => {
            result = removeClass(element, 'add-communication-layer'); // Only mail window
            result = setStyleProperty(element, 'right', '0px', null);
        });
    }
    return result;
};

let setCssText = (element, value) => {
    if (element.style.cssText !== value) {
        element.style.cssText = value;
        return true;
    }
    else return false;
};

let newChange = (func, funcArgs) => { return { verified: false, func: func, args: funcArgs }; };

let rules = [
    { selector: 'div#io-ox-core.abs.unselectable', ...newChange(removeClass, [ 'show-ad' ]) },
    { selector: 'div#io-ox-core.abs.unselectable', ...newChange(setCssText, [ 'margin: 0px;' ]) }, // Screen width >= 1920
    { selector: 'li.mpu-left-bk', ...newChange(removeElement) },
    { id: 'io.ox/mail', ...newChange(removeClass, [ 'add-adv-text-link' ]) },
    { selectorAll: 'div.window-body', ...newChange(checkWindowsBodies) }, // Screen width < 1920
    { selectorAll: 'ul.subfolders li div.folder-node', ...newChange(addFolderBadge) },
    { selector: 'div.rightside', ...newChange(setCssText, [ 'top: 40px !important;' ]) }
];

let timeoutIdLogFunc = null;

let observer = new MutationObserver(mutations => {
    rules.forEach(rule => {
        let param1 = rule.id ? document.getElementById(rule.id) :
            rule.selector ? document.querySelector(rule.selector) :
            rule.selectorAll ? document.querySelectorAll(rule.selectorAll) : null;

        if (param1) {
            let app = rule.args ? rule.func.apply(this, [ param1, ...rule.args ]) : rule.func.apply(this, [ param1 ]);
            if (!rule.verified) rule.verified = app;
        }
    });

    if (timeoutIdLogFunc) clearTimeout(timeoutIdLogFunc);
    timeoutIdLogFunc = setTimeout(() => {
        let objs = [];
        rules.forEach(rule => { if (!rule.verified) objs.push(rule); });
        if (objs.length > 0) logWarning(`Rules unverified: ${JSON.stringify(objs)}`);
        else logInfo('All rules are verified!');
        timeoutIdLogFunc = null;
    }, 5000);
});

observer.observe(document.body,{
    subtree: true,
    childList: true,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false
});
