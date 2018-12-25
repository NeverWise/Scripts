// ==UserScript==
// @name         Improve Amazon
// @namespace    https://github.com/NeverWise/scripts
// @version      0.1
// @description  Add features to Amazon.
// @author       NeverWise
// @match        https://www.amazon.it/*
// @grant        none
// @icon         https://vignette.wikia.nocookie.net/logopedia/images/f/fc/Amazon.com_Favicon_2.svg/revision/latest/scale-to-width-down/480?cb=20160808095346
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-amazon.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/improve-amazon.user.js
// ==/UserScript==

let amznPadWidth = 18;
let amznPadHeight = 14;
let amznHeadHeight = 36;

let marginWidth = 50
let marginHeight = 50;

let timeoutIdLogFunc = null;
let vars = { userGallery: null, userGalleryBody: null, imgPnl: null, imgs: null };

let pixelSize = size => `${size}px`;

let setStyleProperty = (element, property, value) => { if (element.style[property] != value) element.style[property] = value; };

let observer = new MutationObserver(mutations => {
    vars.userGallery = document.querySelector('div.a-popover-modal');
    if (vars.userGallery) {

        let maxWidth = '100%';
        setStyleProperty(vars.userGallery, 'maxWidth', maxWidth);

        let top = pixelSize(marginHeight);
        let left = pixelSize(marginWidth);
        let zeroPx = '0px';
        if (vars.userGallery.style.top === zeroPx && vars.userGallery.style.left === zeroPx) {
            let margin = `${top} 0 0 ${left}`;
            setStyleProperty(vars.userGallery, 'margin', margin);
        }
        else if (vars.userGallery.style.margin === zeroPx) {
            setStyleProperty(vars.userGallery, 'top', top);
            setStyleProperty(vars.userGallery, 'left', left);
        }

        vars.userGalleryBody = vars.userGallery.querySelector('div.reviewLightboxPopoverContainer');
        if (vars.userGalleryBody) {
            let width = pixelSize(document.documentElement.clientWidth - marginWidth * 2 - amznPadWidth * 2);
            setStyleProperty(vars.userGalleryBody, 'width', width);

            let height = pixelSize(document.documentElement.clientHeight - marginHeight * 2 - amznPadHeight * 2 - amznHeadHeight);
            setStyleProperty(vars.userGalleryBody, 'height', height);

            vars.imgPnl = vars.userGalleryBody.querySelector('div.immersiveView');
            vars.imgs = vars.imgPnl.getElementsByTagName('img');
            if (vars.imgPnl && vars.imgs.length === 1) {
                if (vars.imgPnl.getElementsByTagName('svg').length === 0) {
                    let domStr = '<div class="hideButton" style="position:absolute;left: 219px;font-weight: bold;">Visualizza a schermo intero</div>';
                    let domEl = new DOMParser().parseFromString(domStr, 'text/html').body.firstChild;
                    domEl.innerHTML = `<a id="fullImg" href="${vars.imgs[0].src}" target="_blank" style="color: #111;text-decoration: none;"><svg style="width:19px;height:19px;vertical-align: top;position: relative;top: -1px;" viewBox="0 0 24 24"><path fill="#000000" d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z"></path></svg>&nbsp;&nbsp;Visualizza a schermo intero</a>`;
                    vars.imgPnl.insertBefore(domEl, vars.imgPnl.childNodes[vars.imgPnl.childNodes.length - 1]);
                }
                else {
                    let anchor = vars.imgPnl.querySelector('a#fullImg');
                    if (anchor && anchor.href != vars.imgs[0].src) anchor.href = vars.imgs[0].src;
                }
            }
        }
    }

    if (timeoutIdLogFunc) clearTimeout(timeoutIdLogFunc);
    timeoutIdLogFunc = setTimeout(() => {
        for (let key in vars) if (!vars[key]) console.log(`Browser extension: Tampermonkey - Script: Improve Amazon - Warning: Variable "${key}" is null.`);
    }, 5000);
});

observer.observe(document.body,{
    subtree: true,
    childList: true,
    characterData: false,
    attributeOldValue: false,
    characterDataOldValue: false
});
