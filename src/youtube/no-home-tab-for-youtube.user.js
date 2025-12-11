// ==UserScript==
// @match        https://youtube.com/*
// @match        https://www.youtube.com/*
// ==/UserScript==


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
