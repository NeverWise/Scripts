// ==UserScript==
// @name         Improve Libero mail
// @namespace    https://github.com/NeverWise/scripts
// @version      0.1
// @description  Remove ads and show some useful information.
// @author       NeverWise
// @match        https://mail.libero.it/appsuite/*
// @grant        none
// @icon         https://mail.libero.it/appsuite/v=7.8.3-42.20180801.125422/apps/themes/libero/icon57.png
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

let removePushNotification = element => {
    if (element) {
        let removingElement = element.parentNode;
        removingElement.parentNode.removeChild(removingElement);
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
                    let nodes = element.getElementsByClassName('folder-node');
                    if (nodes.length > 0) {
                        let folder_node = nodes[0];
                        if (folder_node.querySelector('.folder-arrow.invisible')) { // This node doesn't contains other folders.
                            if (nodes.length === 1) {
                                let counters = folder_node.getElementsByClassName('folder-counter');
                                if (counters.length === 1) {
                                    let folder_counter = counters[0];
                                    let lbl = `<span class="badge">${nums.length === 2 ? `${nums[1]} | ${nums[0]}` : nums[0]}</span>`;
                                    result = setStyleProperty(folder_counter, 'float', 'right', null);
                                    if (folder_counter.innerHTML != lbl) {
                                        folder_counter.innerHTML = lbl;
                                        result = true;
                                    }
                                    if (!folder_node.classList.contains(showCounterClass)) {
                                        folder_node.classList.add(showCounterClass);
                                        result = true;
                                    }
                                }
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

let newChange = (func, funcArgs) => { return { verified: false, func: func, args: funcArgs }; };

let rules = [
    { selector: 'div#io-ox-core.abs.unselectable', ...newChange(removeClass, [ 'show-ad' ]) },
    { selector: 'div#iol-push-notification.io-ox-dialog-popup', ...newChange(removePushNotification) },
    { id: 'io.ox/mail', ...newChange(removeClass, [ 'add-adv-text-link' ]) },
    { selectorAll: 'div.window-body', ...newChange(checkWindowsBodies) },
    { selectorAll: 'ul.subfolders li', ...newChange(addFolderBadge) }
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
