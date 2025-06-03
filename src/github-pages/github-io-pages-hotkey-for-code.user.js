// ==UserScript==
// @version      1.0.1
// @description  github-io-pages-hotkey-for-code
// @match        https://*.github.io/
// @match        https://*.github.io/*
// ==/UserScript==

// @import{addOnKey}

const findRepo = (url) => {
    const pageEnding = '.github.io'
    const match = url.match(/^https?:\/\/([^/]+)\/([^/]+)/);
    if (match) {
        const host = match[1];
        const project = match[2];
        if (host && host.endsWith(pageEnding)) {
            const user = host.slice(0, -pageEnding.length);
            return `https://github.com/${user}/${project}`
        }
    }
    return null;
}

const action = () => {
    const url = findRepo(document.location.href)
    if (url) {
        document.location.href = url
    }
    return true;
}
const element = document.body;
const key = { code: 'KeyG', altKey: true };
const phase = 'down';
addOnKey({action, element, key, phase})
