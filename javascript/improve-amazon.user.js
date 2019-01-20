// ==UserScript==
// @name         Improve Amazon
// @namespace    https://github.com/NeverWise/scripts
// @version      0.3
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

let marginWidth = 15;
let marginHeight = 15;

let timeoutIdLogFunc = null;
let vars = { userGallery: null, userGalleryBody: null, imgPnl: null, imgs: null };

let pixelSize = size => `${size}px`;

let setStyleProperty = (element, property, value) => { if (element.style[property] != value) element.style[property] = value; };

let observer = new MutationObserver(mutations => {
    let popUps = document.querySelectorAll('div.a-modal-scroller.a-declarative');
    for (let i = 0; i < popUps.length; i++) {
        let compStl = window.getComputedStyle(popUps[i]);
        vars.userGallery = popUps[i].querySelector('div.a-popover-modal');
        if (compStl.getPropertyValue('visibility') === 'visible' || (vars.userGallery && window.getComputedStyle(vars.userGallery).getPropertyValue('display') === 'block'))
        {
            setStyleProperty(vars.userGallery, 'maxWidth', '100%');

            let top = pixelSize(marginHeight);
            let left = pixelSize(marginWidth);
            let zeroPx = '0px';
            if (vars.userGallery.style.top === zeroPx && vars.userGallery.style.left === zeroPx) {
                let margin = `${top} 0 0 ${left}`;
                setStyleProperty(vars.userGallery, 'margin', margin);
            }
            else if (vars.userGallery.style.margin === zeroPx || !vars.userGallery.style.margin) {
                setStyleProperty(vars.userGallery, 'top', top);
                setStyleProperty(vars.userGallery, 'left', left);
            }

            let amznWidth = 0, amznHeight = 0;
            if (vars.userGallery.querySelector('header.a-popover-header')) {
                amznWidth = amznPadWidth * 2;
                amznHeight = amznPadHeight * 2 + amznHeadHeight;
            }
            let width = pixelSize(document.documentElement.clientWidth - marginWidth * 2 - amznWidth);
            let height = pixelSize(document.documentElement.clientHeight - marginHeight * 2 - amznHeight);

            vars.userGalleryBody = vars.userGallery.querySelector('div.reviewLightboxPopoverContainer');
            let strWrapEl, funcAddEl;
            let fullScreenAddStyle = '';
            if (vars.userGalleryBody) {
                setStyleProperty(vars.userGalleryBody, 'width', width);
                setStyleProperty(vars.userGalleryBody, 'height', height);

                setStyleProperty(vars.userGallery, 'height', 'auto');
                let innerPopup = vars.userGallery.querySelector('div.a-popover-inner');
                if (innerPopup) setStyleProperty(innerPopup, 'height', 'auto');

                vars.imgPnl = vars.userGalleryBody.querySelector('div.immersiveView');
                strWrapEl = '<div class="hideButton" style="position:absolute;left: 219px;font-weight: bold;"></div>';
                funcAddEl = el => vars.imgPnl.insertBefore(el, vars.imgPnl.childNodes[vars.imgPnl.childNodes.length - 1]);
            }
            else {
                setStyleProperty(vars.userGallery, 'width', width);
                setStyleProperty(vars.userGallery, 'height', height);

                vars.imgPnl = vars.userGallery.querySelector('div#ivLargeImage');
                strWrapEl = '<div class="a-button a-button-primary" style="position: absolute;top: 35px;right: 35px"></div>';
                fullScreenAddStyle = 'padding: 5px; display: block;';
                funcAddEl = el => vars.imgPnl.appendChild(el);
            }
            if (vars.imgPnl) {
                vars.imgs = vars.imgPnl.getElementsByTagName('img');
                if (vars.imgs.length === 1) {
                    if (vars.imgPnl.getElementsByTagName('svg').length === 0) {
                        let domEl = new DOMParser().parseFromString(strWrapEl, 'text/html').body.firstChild;
                        domEl.innerHTML = `<a id="fullImg" href="${vars.imgs[0].src}" target="_blank" style="color: #111;text-decoration: none;${fullScreenAddStyle}"><svg style="width:19px;height:19px;vertical-align: top;position: relative;top: -1px;" viewBox="0 0 24 24"><path fill="#000000" d="M9.5,13.09L10.91,14.5L6.41,19H10V21H3V14H5V17.59L9.5,13.09M10.91,9.5L9.5,10.91L5,6.41V10H3V3H10V5H6.41L10.91,9.5M14.5,13.09L19,17.59V14H21V21H14V19H17.59L13.09,14.5L14.5,13.09M13.09,9.5L17.59,5H14V3H21V10H19V6.41L14.5,10.91L13.09,9.5Z"></path></svg>&nbsp;&nbsp;Visualizza a schermo intero</a>`;
                        funcAddEl(domEl);
                    }
                    else {
                        let anchor = vars.imgPnl.querySelector('a#fullImg');
                        if (anchor && anchor.href != vars.imgs[0].src) anchor.href = vars.imgs[0].src;
                    }
                }
            }
            break;
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
