// ==UserScript==
// @match        https://*.github.io/
// @match        https://*.github.io/*
// ==/UserScript==

// @import{addOnKey}
// @import{openLinkInNewTab}

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

const findMainRepo = (url) => {
    const pageEnding = '.github.io'
    const match = url.match(/^https?:\/\/([^/]+)/);
    if (match) {
        const host = match[1];
        if (host && host.endsWith(pageEnding)) {
            const user = host.slice(0, -pageEnding.length);
            return `https://github.com/${user}/${host}`
        }
    }
    return null;
}

const action = () => {
    const url = findRepo(document.location.href)
    if (url) {
        openLinkInNewTab(url)
    }
    return true;
}

const actionForMainRepo = () => {
    const url = findMainRepo(document.location.href)
    if (url) {
        openLinkInNewTab(url)
    }
    return true;
}

const element = document.body;
const key = { code: 'KeyG', altKey: true };
const keyForMainRepo = { code: 'KeyG', altKey: true, shiftKey: true };
const phase = 'down';
addOnKey({action, element, key, phase})
addOnKey({action: actionForMainRepo, element, key: keyForMainRepo, phase})
