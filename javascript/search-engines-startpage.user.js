// ==UserScript==
// @name         Search engines bar for Startpage.com
// @namespace    https://github.com/NeverWise/scripts
// @version      0.1
// @description  Bar with other preferred search engines
// @author       NeverWise
// @match        https://www.startpage.com/do/search
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=www.startpage.com
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/search-engines-startpage.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/search-engines-startpage.user.js
// ==/UserScript==

let query = encodeURIComponent(document.getElementById('query').value);
let searchEngines = [
    { title: 'Qwant', img: 'https://www.qwant.com/favicon-64.png', url: `https://www.qwant.com/?q=${query}&t=web` },
    { title: 'Swisscows', img: 'https://swisscows.ch/favicon-72.png', url: `https://swisscows.ch/web?query=${query}` },
    { title: 'Ecosia', img: 'https://www.ecosia.org/apple-touch-icon.png', url: `https://www.ecosia.org/search?q=${query}` }
];

let divMenu = document.createElement('div');
divMenu.style.position = 'fixed';
divMenu.style.right = 0;
divMenu.style.top = `${(document.documentElement.clientHeight - (searchEngines.length * 40 + 12)) / 2}px`;
divMenu.style.borderRadius = '4px 0 0 4px';
divMenu.style.padding = '10px 0 0 7px';
divMenu.style.boxShadow = '0 2px 4px #ebecf7';
divMenu.style.border = '1px solid #ebecf7';
divMenu.style.background = 'white';
divMenu.style.zIndex = 1;

for (let i = 0; i < searchEngines.length; i++) {
    if ((searchEngines[i].title || searchEngines[i].img) && searchEngines[i].url) {
        let anchor = document.createElement('a');
        anchor.href = searchEngines[i].url;
        anchor.title = searchEngines[i].title;
        anchor.style.display = 'block';
        anchor.style.padding = '0 5px 10px 0';
        divMenu.appendChild(anchor);

        let img = document.createElement('img');
        img.style.display = 'block';
        img.style.height = '30px';
        img.src = searchEngines[i].img;
        img.alt = searchEngines[i].title;
        anchor.appendChild(img);
    }
}

document.querySelector('.container').appendChild(divMenu);
