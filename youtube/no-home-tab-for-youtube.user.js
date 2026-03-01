// ==UserScript==
// @name        no-home-tab-for-youtube
// @namespace   https://github.com/gissehel/userscripts
// @version     20260205-162358-f91f16a
// @description no-home-tab-for-youtube
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       https://youtube.com/*
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @main_begin{no-home-tab-for-youtube}
const onHomeTabChangeToVideos = () => {
    const parts = location.href.split('/')
    console.log('onHomeTabChangeToVideos', parts)

    if (parts.length === 4 || parts.length === 5) {
        if (parts[0] !== 'https:' || parts[1] !== '' || parts[2] !== 'www.youtube.com') {
            return
        }
        if (parts[3].length === 0) {
            return
        }
        if (parts[3][0] !== '@') {
            return
        }
        if (parts.length === 5 && parts[4] !== 'featured') {
            return
        }
        if (parts.length === 5) {
            parts.pop(-1)
        }
        parts.push('videos')
        const newUrl = parts.join('/')
        console.log(`Redirecting from ${location.href} to ${newUrl}`)
        location.href = newUrl
    }
}

let lastUrl = null;

function urlChangeHandler() {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('URL changed to:', lastUrl);
        onHomeTabChangeToVideos()
    }
}
window.addEventListener('popstate', urlChangeHandler);
window.addEventListener('hashchange', urlChangeHandler);

setInterval(urlChangeHandler, 500);

onHomeTabChangeToVideos()
// @main_end{no-home-tab-for-youtube}

console.log(`End - ${script_id}`)
