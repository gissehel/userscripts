// ==UserScript==
// @version      1.0.0
// @description  no-home-tab-for-youtube
// @match        https://youtube.com/*@[^/]+
// @match        https://youtube.com/*@[^/]+/featured
// @match        https://www.youtube.com/*@[^/]+
// @match        https://www.youtube.com/*@[^/]+/featured
// ==/UserScript==


const main = () => {
    const parts = location.href.split('/')

    if (parts.length === 4 || parts.length === 5) {
        if (parts[0] !== 'https:' || parts[1] !== '' || parts[2] !== 'www.youtube.com') {
            return
        }
        if (parts[3].length === 0) {
            return
        }
        if (parts.length === 5 && parts[4] !== 'featured') {
            return
        }
        if (parts.length === 5) {
            parts.pop(-1)
        }
        parts.push('videos')
        location.href = parts.join('/')
    }
}
main()