// ==UserScript==
// @name         Paramount Network video download
// @namespace    https://github.com/NeverWise/scripts
// @version      0.1
// @description  Find rtmp stream and show command for download.
// @author       NeverWise
// @match        https://www.paramountnetwork.it/episodi/*
// @match        https://www.paramountnetwork.it/film/*
// @grant        none
// @icon         https://www.paramountnetwork.it/apple-touch-icon.png
// @updateURL    https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/paramount-network.user.js
// @downloadURL  https://raw.githubusercontent.com/NeverWise/Scripts/master/javascript/paramount-network.user.js
// ==/UserScript==

(function() {
    'use strict';

    var scripts = [].slice.call(document.getElementsByTagName('script'), 0);
    var script = scripts.find(lScript => lScript.attributes.length === 0);

    var regEx = /"config":{"uri":"(.+?)"/g;
    var match = regEx.exec(script.innerText);

    var url = `https://media.mtvnservices.com/pmt/e1/access/index.html?uri=${match[1]}&configtype=edge`;
    fetch(url).then(function(response) {
        if (response.ok) return response.json();
        else return response.statusText;
    }).then(function(result) {
        if (typeof result === 'object') {
            fetch(result.feed.items[0].group.content).then(function(response) {
                if (response.ok) return response.text();
                else return response.statusText;
            }).then(function(result) {
                regEx = /<rendition.*?width="(.+?)" height="(.+?)".*?bitrate="(.+?)">[\s\S]*?<src>(.+?)<\/src>/gm;
                var container = document.querySelector('div.meta-wrap');
                match = null;
                while (match = regEx.exec(result)) {

                    var rtmp = match[4];
                    var index = rtmp.lastIndexOf('/');
                    var filename = rtmp.substr(index + 1);
                    if (!filename.endsWith('.mp4')) filename = `${filename}.mp4`;
                    var command = `rtmpdump -R -o ${filename} -r '${rtmp}'`;
                    var id = `${match[1]}${match[2]}${match[3]}`;

                    var anchorCopy = document.createElement('a');
                    anchorCopy.style.cursor = 'pointer';
                    anchorCopy.setAttribute('data', command);
                    anchorCopy.innerText = 'copy';

                    var anchorSH = document.createElement('a');
                    anchorSH.style.cursor = 'pointer';
                    anchorSH.setAttribute('data', id);
                    anchorSH.innerText = 'show';

                    var spanHeader = document.createElement('span');
                    spanHeader.appendChild(document.createTextNode(`${match[1]} x ${match[2]} - bitrate ${match[3]} - `));
                    spanHeader.appendChild(anchorCopy);
                    spanHeader.appendChild(document.createTextNode(' - '));
                    spanHeader.appendChild(anchorSH);

                    var divHeader = document.createElement('div');
                    divHeader.className = 'spr-header';
                    divHeader.style.color = '#fff';
                    divHeader.style.textDecoration = 'underline';
                    divHeader.style.margin = 0;
                    divHeader.appendChild(spanHeader);

                    var spanCommand = document.createElement('span');
                    spanCommand.innerText = command;

                    var divCommand = document.createElement('div');
                    divCommand.className = 'deck';
                    divCommand.id = id;
                    divCommand.style.display = 'none';
                    divCommand.style.fontFamily = 'monospace';
                    divCommand.appendChild(spanCommand);

                    container.appendChild(divHeader);
                    container.appendChild(divCommand);
                }
                container.addEventListener('click', e => {
                    if (e.target.nodeName.toUpperCase() !== 'A') return;
                    var data = e.target.getAttribute('data');
                    if (!isNaN(parseInt(data, 10))) {
                        var el = document.getElementById(data);
                        if (el.style.display === 'none') {
                            e.target.innerText = 'hide';
                            el.style.display = 'block';
                        }
                        else {
                            e.target.innerText = 'show';
                            el.style.display = 'none';
                        }
                    }
                    else navigator.clipboard.writeText(data);
                });
            });
        }
        else console.log(result);
    });
})();
